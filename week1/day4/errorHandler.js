// middleware/errorHandler.js - Centralized error handling

// Custom error classes
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400);
        this.name = 'ValidationError';
        this.details = details;
    }
}

class NotFoundError extends AppError {
    constructor(resource, id) {
        super(`${resource} with ID ${id} not found`, 404);
        this.name = 'NotFoundError';
        this.resource = resource;
        this.id = id;
    }
}

class DuplicateError extends AppError {
    constructor(field, value) {
        super(`${field} '${value}' already exists`, 409);
        this.name = 'DuplicateError';
        this.field = field;
        this.value = value;
    }
}

// Async handler to avoid try-catch repetition
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler for routes not found
const notFoundHandler = (req, res, next) => {
    const error = new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404);
    next(error);
};

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    // Log error
    console.error('='.repeat(60));
    console.error('ERROR DETAILS:');
    console.error(`Time: ${new Date().toISOString()}`);
    console.error(`Method: ${req.method}`);
    console.error(`URL: ${req.originalUrl}`);
    console.error(`IP: ${req.ip}`);
    console.error(`Message: ${err.message}`);
    console.error(`Stack: ${err.stack}`);
    console.error('='.repeat(60));
    
    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let details = err.details || null;
    
    // Handle MySQL specific errors
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Duplicate entry error';
        details = 'A record with this value already exists in the database';
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'Foreign key constraint failed';
        details = 'Referenced record does not exist';
    }
    
    if (err.code === 'ER_DATA_TOO_LONG') {
        statusCode = 400;
        message = 'Data too long';
        details = 'One or more fields exceed maximum length';
    }
    
    if (err.code === 'ER_BAD_NULL_ERROR') {
        statusCode = 400;
        message = 'Required field is null';
        details = 'A required field was not provided';
    }
    
    // Send response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            status_code: statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            method: req.method,
            request_id: req.requestId || null
        },
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Request logger middleware
const requestLogger = (req, res, next) => {
    req.requestId = Math.random().toString(36).substring(7);
    req.requestTime = new Date().toISOString();
    console.log(`[${req.requestId}] ${req.method} ${req.path} - Started`);
    
    // Log response time
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.requestId}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    });
    
    next();
};

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    DuplicateError,
    asyncHandler,
    notFoundHandler,
    errorHandler,
    requestLogger
};