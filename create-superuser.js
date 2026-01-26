require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE
});

async function createSuperuser() {
    try {
        // Get username and password from command line or use defaults
        const username = process.argv[2] || 'superadmin';
        const password = process.argv[3] || 'superadmin123';

        console.log(`Creating superuser: ${username}`);

        // Check if user already exists
        const checkResult = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (checkResult.rows.length > 0) {
            console.log(`❌ User '${username}' already exists!`);
            console.log('Use a different username or delete the existing user first.');
            process.exit(1);
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new superuser
        const insertResult = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        console.log('✅ Superuser created successfully!');
        console.log('==================================');
        console.log(`Username: ${insertResult.rows[0].username}`);
        console.log(`Password: ${password}`);
        console.log(`User ID: ${insertResult.rows[0].id}`);
        console.log('==================================');
        console.log('⚠️  Please save these credentials and change the password after first login!');

    } catch (error) {
        console.error('❌ Error creating superuser:', error.message);
        if (error.code === '42P01') {
            console.log('The users table does not exist. Please run migrations first.');
        }
    } finally {
        await pool.end();
    }
}

createSuperuser();
