// server.js - Main Express server with error handling
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./db');
const bookRoutes = require('./routes/books');
const { requestLogger, notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========

// Request logging
app.use(morgan('dev'));
app.use(requestLogger);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers (for development)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ========== TEST DATABASE CONNECTION ==========
(async () => {
    const isConnected = await db.testConnection();
    if (!isConnected) {
        console.error('\n⚠️  Warning: Could not connect to MySQL database');
        console.error('   Make sure XAMPP MySQL is running and database exists\n');
    }
})();

// ========== ROUTES ==========

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Bookstore REST API',
        version: '2.0.0',
        documentation: {
            books: {
                base_url: '/api/books',
                endpoints: {
                    'GET /': 'Get all books (supports filtering and pagination)',
                    'GET /:id': 'Get book by ID',
                    'POST /': 'Create new book',
                    'PUT /:id': 'Update entire book',
                    'PATCH /:id/stock': 'Update book stock',
                    'DELETE /:id': 'Delete book'
                },
                filters: {
                    genre: 'Filter by genre',
                    author: 'Filter by author (partial match)',
                    min_price: 'Minimum price',
                    max_price: 'Maximum price',
                    in_stock: 'true/false',
                    limit: 'Results per page',
                    page: 'Page number',
                    sort: 'Sort by field (title, author, price, stock_quantity, published_date)'
                }
            }
        },
        request_id: req.requestId,
        timestamp: req.requestTime
    });
});

// Health check endpoint
app.get('/health', async (req, res) => {
    const dbStatus = await db.testConnection();
    res.json({
        status: dbStatus ? 'OK' : 'Degraded',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'connected' : 'disconnected',
        request_id: req.requestId
    });
});

// Mount book routes
app.use('/api/books', bookRoutes);

// ========== ERROR HANDLING ==========

// 404 handler - Route not found (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ========== START SERVER ==========
const server = app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('📚 BOOKSTORE REST API SERVER');
    console.log('='.repeat(60));
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
    console.log('\n📖 Book API Endpoints:');
    console.log(`   GET    /api/books           - Get all books`);
    console.log(`   GET    /api/books/:id       - Get book by ID`);
    console.log(`   POST   /api/books           - Create new book`);
    console.log(`   PUT    /api/books/:id       - Update book`);
    console.log(`   PATCH  /api/books/:id/stock - Update stock`);
    console.log(`   DELETE /api/books/:id       - Delete book`);
    console.log('\n🔍 Test Examples:');
    console.log(`   curl http://localhost:${PORT}/api/books`);
    console.log(`   curl http://localhost:${PORT}/api/books/1`);
    console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        if (db.pool) {
            db.pool.end();
        }
    });
});

module.exports = app;