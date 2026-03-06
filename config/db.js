const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');
const logger = require('./logger');

console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_DATABASE)

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

pool.on('connect', () => {
    logger.info('Connected to the PostgreSQL database', {
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME
    });
});

// Test connection immediately
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        logger.error('Database connection error', { error: err.message });
    } else {
        logger.info('Database connection verified', { timestamp: res.rows[0].now });
    }
});

pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', { error: err.message, stack: err.stack });
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
