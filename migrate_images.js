const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

async function migrate() {
    try {
        console.log('Starting migration...');

        // Add image_url to info_cards if it doesn't exist
        try {
            await pool.query('ALTER TABLE info_cards ADD COLUMN image_url TEXT');
            console.log('Added image_url column to info_cards table.');
        } catch (err) {
            if (err.code === '42701') { // duplicate_column
                console.log('Column image_url already exists in info_cards table.');
            } else {
                throw err;
            }
        }

        // Add image_url to achievements_entries if it doesn't exist
        try {
            await pool.query('ALTER TABLE achievements_entries ADD COLUMN image_url TEXT');
            console.log('Added image_url column to achievements_entries table.');
        } catch (err) {
            if (err.code === '42701') { // duplicate_column
                console.log('Column image_url already exists in achievements_entries table.');
            } else {
                throw err;
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
