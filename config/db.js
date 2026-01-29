const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
    console.log(`  Host: ${process.env.DB_HOST}`);
    console.log(`  Database: ${process.env.DB_DATABASE}`);
    console.log(`  User: ${process.env.DB_USERNAME}`);
});

// Test connection immediately
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connection verified at:', res.rows[0].now);
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
