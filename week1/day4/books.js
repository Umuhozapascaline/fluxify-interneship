// routes/books.js - Complete REST API for Book entity
const express = require('express');
const router = express.Router();
const db = require('../db');

// ========== HELPER FUNCTIONS ==========

// Validate book data for POST and PUT requests
function validateBookData(data, isUpdate = false) {
    const errors = [];
    
    if (!isUpdate) {
        // Required fields for POST (create)
        if (!data.title || data.title.trim() === '') {
            errors.push('title is required and cannot be empty');
        }
        
        if (!data.author || data.author.trim() === '') {
            errors.push('author is required and cannot be empty');
        }
        
        if (!data.price && data.price !== 0) {
            errors.push('price is required');
        } else if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
            errors.push('price must be a positive number');
        }
        
        if (!data.stock_quantity && data.stock_quantity !== 0) {
            errors.push('stock_quantity is required');
        } else if (data.stock_quantity !== undefined && (isNaN(data.stock_quantity) || data.stock_quantity < 0)) {
            errors.push('stock_quantity must be a non-negative integer');
        }
    } else {
        // For PUT (update), at least one field should be provided
        if (!data.title && !data.author && !data.genre && 
            data.price === undefined && data.stock_quantity === undefined && 
            !data.published_date) {
            errors.push('At least one field must be provided for update');
        }
        
        // Validate price if provided
        if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
            errors.push('price must be a positive number');
        }
        
        // Validate stock_quantity if provided
        if (data.stock_quantity !== undefined && (isNaN(data.stock_quantity) || data.stock_quantity < 0)) {
            errors.push('stock_quantity must be a non-negative integer');
        }
    }
    
    // Validate genre if provided
    const validGenres = ['Fiction', 'Non-Fiction', 'Classic', 'Fantasy', 'Dystopian', 'Romance', 'Mystery', 'Sci-Fi'];
    if (data.genre && !validGenres.includes(data.genre)) {
        errors.push(`genre must be one of: ${validGenres.join(', ')}`);
    }
    
    // Validate published_date format if provided
    if (data.published_date && !isValidDate(data.published_date)) {
        errors.push('published_date must be a valid date (YYYY-MM-DD)');
    }
    
    return errors;
}

// Validate date format (YYYY-MM-DD)
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Format book data for response
function formatBook(book) {
    return {
        book_id: book.book_id,
        title: book.title,
        author: book.author,
        genre: book.genre || null,
        price: parseFloat(book.price),
        stock_quantity: parseInt(book.stock_quantity),
        published_date: book.published_date,
        in_stock: book.stock_quantity > 0,
        stock_status: book.stock_quantity === 0 ? 'Out of Stock' : 
                     book.stock_quantity < 10 ? 'Low Stock' : 'In Stock'
    };
}

// ========== 1. GET /api/books - Get all books ==========
router.get('/', async (req, res, next) => {
    try {
        // Support query parameters for filtering
        const { genre, author, min_price, max_price, in_stock, limit = 100, page = 1, sort = 'title' } = req.query;
        let sql = 'SELECT * FROM Book WHERE 1=1';
        const params = [];
        
        // Filter by genre
        if (genre) {
            sql += ' AND genre = ?';
            params.push(genre);
        }
        
        // Filter by author
        if (author) {
            sql += ' AND author LIKE ?';
            params.push(`%${author}%`);
        }
        
        // Filter by price range
        if (min_price) {
            sql += ' AND price >= ?';
            params.push(parseFloat(min_price));
        }
        
        if (max_price) {
            sql += ' AND price <= ?';
            params.push(parseFloat(max_price));
        }
        
        // Filter by stock availability
        if (in_stock === 'true') {
            sql += ' AND stock_quantity > 0';
        } else if (in_stock === 'false') {
            sql += ' AND stock_quantity = 0';
        }
        
        // Sorting
        const validSortFields = ['title', 'author', 'price', 'stock_quantity', 'published_date'];
        const sortField = validSortFields.includes(sort) ? sort : 'title';
        sql += ` ORDER BY ${sortField} ASC`;
        
        // Add pagination
        const offset = (page - 1) * limit;
        sql += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const result = await db.executeQuery(sql, params);
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        // Format each book
        const formattedBooks = result.data.map(formatBook);
        
        // Get total count for pagination info
        const countResult = await db.executeQuery(
            'SELECT COUNT(*) as total FROM Book'
        );
        const total = countResult.success ? countResult.data[0].total : 0;
        
        res.json({
            success: true,
            count: formattedBooks.length,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                total_pages: Math.ceil(total / limit)
            },
            filters: { genre, author, min_price, max_price, in_stock, sort },
            data: formattedBooks
        });
        
    } catch (error) {
        next(error);
    }
});

// ========== 2. GET /api/books/:id - Get single book ==========
router.get('/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        
        // Validate ID is a number
        if (isNaN(bookId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid book ID format',
                message: 'Book ID must be a number'
            });
        }
        
        // Get book details
        const result = await db.executeQuery(
            'SELECT * FROM Book WHERE book_id = ?',
            [bookId]
        );
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        // Return 404 if book not found
        if (result.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Book not found',
                message: `No book found with ID ${bookId}`
            });
        }
        
        // Get sales statistics for this book
        const salesResult = await db.executeQuery(
            `SELECT 
                COUNT(DISTINCT oi.order_id) as times_ordered,
                SUM(oi.quantity) as total_copies_sold,
                SUM(oi.quantity * oi.unit_price) as total_revenue,
                AVG(oi.quantity) as avg_quantity_per_order
             FROM Order_Item oi
             WHERE oi.book_id = ?`,
            [bookId]
        );
        
        const book = formatBook(result.data[0]);
        
        // Add sales statistics
        if (salesResult.success && salesResult.data[0]) {
            book.sales_stats = {
                times_ordered: parseInt(salesResult.data[0].times_ordered || 0),
                total_copies_sold: parseInt(salesResult.data[0].total_copies_sold || 0),
                total_revenue: parseFloat(salesResult.data[0].total_revenue || 0).toFixed(2),
                avg_quantity_per_order: parseFloat(salesResult.data[0].avg_quantity_per_order || 0).toFixed(1)
            };
        }
        
        res.json({
            success: true,
            data: book
        });
        
    } catch (error) {
        next(error);
    }
});

// ========== 3. POST /api/books - Create new book ==========
router.post('/', async (req, res, next) => {
    try {
        const { title, author, genre, price, stock_quantity, published_date } = req.body;
        
        // Validate required fields
        const validationErrors = validateBookData({ title, author, genre, price, stock_quantity, published_date });
        
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors,
                received_data: req.body
            });
        }
        
        // Check if book with same title and author already exists
        const duplicateCheck = await db.executeQuery(
            'SELECT book_id FROM Book WHERE title = ? AND author = ?',
            [title, author]
        );
        
        if (duplicateCheck.success && duplicateCheck.data.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Duplicate book',
                message: `A book with title "${title}" by "${author}" already exists`
            });
        }
        
        // Insert new book
        const result = await db.executeQuery(
            `INSERT INTO Book (title, author, genre, price, stock_quantity, published_date) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, author, genre || null, parseFloat(price), parseInt(stock_quantity), published_date || null]
        );
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        // Fetch the newly created book
        const newBook = await db.executeQuery(
            'SELECT * FROM Book WHERE book_id = ?',
            [result.data.insertId]
        );
        
        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: formatBook(newBook.data[0])
        });
        
    } catch (error) {
        next(error);
    }
});

// ========== 4. PUT /api/books/:id - Update existing book ==========
router.put('/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        
        // Validate ID
        if (isNaN(bookId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid book ID format',
                message: 'Book ID must be a number'
            });
        }
        
        const { title, author, genre, price, stock_quantity, published_date } = req.body;
        
        // Check if book exists
        const existingBook = await db.executeQuery(
            'SELECT * FROM Book WHERE book_id = ?',
            [bookId]
        );
        
        if (!existingBook.success || existingBook.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Book not found',
                message: `Cannot update - no book found with ID ${bookId}`
            });
        }
        
        // Validate update data
        const validationErrors = validateBookData(
            { title, author, genre, price, stock_quantity, published_date },
            true // isUpdate = true
        );
        
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors,
                received_data: req.body
            });
        }
        
        // Check for duplicate if title or author is changing
        if (title || author) {
            const newTitle = title || existingBook.data[0].title;
            const newAuthor = author || existingBook.data[0].author;
            
            const duplicateCheck = await db.executeQuery(
                'SELECT book_id FROM Book WHERE title = ? AND author = ? AND book_id != ?',
                [newTitle, newAuthor, bookId]
            );
            
            if (duplicateCheck.success && duplicateCheck.data.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: 'Duplicate book',
                    message: `Another book with title "${newTitle}" by "${newAuthor}" already exists`
                });
            }
        }
        
        // Build dynamic update query
        const updates = [];
        const values = [];
        
        if (title) {
            updates.push('title = ?');
            values.push(title);
        }
        if (author) {
            updates.push('author = ?');
            values.push(author);
        }
        if (genre !== undefined) {
            updates.push('genre = ?');
            values.push(genre || null);
        }
        if (price !== undefined) {
            updates.push('price = ?');
            values.push(parseFloat(price));
        }
        if (stock_quantity !== undefined) {
            updates.push('stock_quantity = ?');
            values.push(parseInt(stock_quantity));
        }
        if (published_date !== undefined) {
            updates.push('published_date = ?');
            values.push(published_date || null);
        }
        
        values.push(bookId);
        
        const result = await db.executeQuery(
            `UPDATE Book SET ${updates.join(', ')} WHERE book_id = ?`,
            values
        );
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        // Fetch updated book
        const updatedBook = await db.executeQuery(
            'SELECT * FROM Book WHERE book_id = ?',
            [bookId]
        );
        
        res.json({
            success: true,
            message: 'Book updated successfully',
            data: formatBook(updatedBook.data[0])
        });
        
    } catch (error) {
        next(error);
    }
});

// ========== 5. DELETE /api/books/:id - Delete book ==========
router.delete('/:id', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        
        // Validate ID
        if (isNaN(bookId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid book ID format',
                message: 'Book ID must be a number'
            });
        }
        
        // Check if book exists and get additional info
        const existingBook = await db.executeQuery(
            'SELECT b.*, COUNT(oi.order_item_id) as order_count FROM Book b LEFT JOIN Order_Item oi ON b.book_id = oi.book_id WHERE b.book_id = ?',
            [bookId]
        );
        
        if (!existingBook.success || existingBook.data.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Book not found',
                message: `Cannot delete - no book found with ID ${bookId}`
            });
        }
        
        const book = existingBook.data[0];
        const hasOrders = book.order_count > 0;
        
        // Check if book has been ordered
        if (hasOrders) {
            return res.status(409).json({
                success: false,
                error: 'Cannot delete book with order history',
                message: `This book has been ordered ${book.order_count} time(s). Consider marking as discontinued instead.`,
                details: {
                    book_id: parseInt(bookId),
                    title: book.title,
                    order_count: parseInt(book.order_count)
                }
            });
        }
        
        // Delete book
        const result = await db.executeQuery(
            'DELETE FROM Book WHERE book_id = ?',
            [bookId]
        );
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        res.json({
            success: true,
            message: 'Book deleted successfully',
            data: {
                deleted_book_id: parseInt(bookId),
                book_title: book.title,
                book_author: book.author,
                was_in_stock: book.stock_quantity > 0
            }
        });
        
    } catch (error) {
        next(error);
    }
});

// ========== BONUS: PATCH /api/books/:id/stock - Update stock only ==========
router.patch('/:id/stock', async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const { quantity_change } = req.body;
        
        if (quantity_change === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing quantity_change field',
                message: 'Please provide quantity_change (positive or negative integer)'
            });
        }
        
        if (isNaN(quantity_change)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid quantity_change',
                message: 'quantity_change must be a number'
            });
        }
        
        const result = await db.executeQuery(
            'UPDATE Book SET stock_quantity = stock_quantity + ? WHERE book_id = ?',
            [parseInt(quantity_change), bookId]
        );
        
        if (!result.success) {
            throw new Error(result.error);
        }
        
        if (result.data.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Book not found',
                message: `No book found with ID ${bookId}`
            });
        }
        
        const updatedBook = await db.executeQuery(
            'SELECT book_id, title, stock_quantity FROM Book WHERE book_id = ?',
            [bookId]
        );
        
        res.json({
            success: true,
            message: `Stock updated by ${quantity_change}`,
            data: {
                book_id: parseInt(bookId),
                title: updatedBook.data[0].title,
                previous_stock: updatedBook.data[0].stock_quantity - parseInt(quantity_change),
                new_stock: updatedBook.data[0].stock_quantity,
                change: parseInt(quantity_change)
            }
        });
        
    } catch (error) {
        next(error);
    }
});

module.exports = router;