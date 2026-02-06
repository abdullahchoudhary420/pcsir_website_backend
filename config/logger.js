const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log directory
const logDir = path.join(__dirname, '../logs');

// Custom format for console output
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
    })
);

// JSON format for file output (structured logs)
const fileFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create transports
const transports = [
    // Console transport with colors
    new winston.transports.Console({
        format: consoleFormat,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    })
];

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
    transports.push(
        new DailyRotateFile({
            dirname: logDir,
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: fileFormat,
            level: 'info'
        }),
        new DailyRotateFile({
            dirname: logDir,
            filename: 'error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            format: fileFormat,
            level: 'error'
        })
    );
}

// Create the logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: { service: 'pcsir-backend' },
    transports
});

// Helper methods for structured logging
logger.request = (req, message) => {
    logger.info(message, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });
};

logger.dbError = (operation, error) => {
    logger.error(`Database error during ${operation}`, {
        operation,
        error: error.message,
        stack: error.stack
    });
};

module.exports = logger;
