/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent error responses
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Multer file upload errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size is 6MB.'
        });
    }

    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Validation errors (express-validator)
    if (err.array && typeof err.array === 'function') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.array()
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired'
        });
    }

    // Database errors
    if (err.code === '23505') { // Unique violation
        return res.status(409).json({
            success: false,
            message: 'Resource already exists'
        });
    }

    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({
            success: false,
            message: 'Referenced resource does not exist'
        });
    }

    // Default error response
    const statusCode = err.statusCode || 500;
    // DEBUG: Force show error details even in production to diagnose deployment issues
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        message,
        stack: err.stack, // DEBUG: Always show stack
        errorCode: err.code // DEBUG: Show DB error code if available
    });
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};
