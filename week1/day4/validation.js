// middleware/validation.js - Request validation middleware

// Validation rules for Book resource
const validateBook = (req, res, next) => {
    const errors = [];
    const { title, author, price, stock_quantity, genre, published_date } = req.body;
    
    // POST request - all fields required
    if (req.method === 'POST') {
        if (!title || title.trim() === '') {
            errors.push('title is required and cannot be empty');
        }
        
        if (!author || author.trim() === '') {
            errors.push('author is required and cannot be empty');
        }
        
        if (price === undefined || price === null) {
            errors.push('price is required');
        } else if (isNaN(price) || price < 0) {
            errors.push('price must be a positive number');
        }
        
        if (stock_quantity === undefined || stock_quantity === null) {
            errors.push('stock_quantity is required');
        } else if (isNaN(stock_quantity) || stock_quantity < 0) {
            errors.push('stock_quantity must be a non-negative integer');
        }
    }
    
    // PUT request - validate provided fields
    if (req.method === 'PUT') {
        if (title !== undefined && title.trim() === '') {
            errors.push('title cannot be empty');
        }
        
        if (author !== undefined && author.trim() === '') {
            errors.push('author cannot be empty');
        }
        
        if (price !== undefined && (isNaN(price) || price < 0)) {
            errors.push('price must be a positive number');
        }
        
        if (stock_quantity !== undefined && (isNaN(stock_quantity) || stock_quantity < 0)) {
            errors.push('stock_quantity must be a non-negative integer');
        }
        
        // Check if at least one field is provided for update
        if (!title && !author && !genre && price === undefined && stock_quantity === undefined && !published_date) {
            errors.push('At least one field must be provided for update');
        }
    }
    
    // Common validations for both POST and PUT
    if (genre !== undefined && genre !== '') {
        const validGenres = ['Fiction', 'Non-Fiction', 'Classic', 'Fantasy', 'Dystopian', 'Romance', 'Mystery', 'Sci-Fi'];
        if (!validGenres.includes(genre)) {
            errors.push(`genre must be one of: ${validGenres.join(', ')}`);
        }
    }
    
    if (published_date && !/^\d{4}-\d{2}-\d{2}$/.test(published_date)) {
        errors.push('published_date must be in YYYY-MM-DD format');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors,
            received_data: req.body
        });
    }
    
    next();
};

// Validate ID parameter
const validateId = (req, res, next) => {
    const id = req.params.id;
    
    if (!id || isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID parameter',
            message: 'ID must be a positive integer',
            received: id
        });
    }
    
    next();
};

module.exports = { validateBook, validateId };