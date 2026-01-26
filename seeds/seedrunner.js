require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

async function runSeeds() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL.');

    // Truncate tables in the proper order to avoid foreign key issues
    const tablesToTruncate = [
      'labs',
      'publications',
      'social_links',
      'statistics',
      'services',
      'site_settings',
      'about_entries',
      'info_cards',
      'projects',
      'users',
      'navbar'
    ];

    // Disable triggers (foreign key constraints) temporarily
    await client.query('SET session_replication_role = replica;');

    for (const table of tablesToTruncate) {
      console.log(`🧹 Truncating table: ${table}`);
      await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
    }

    // Re-enable triggers
    await client.query('SET session_replication_role = DEFAULT;');

    // Now run SQL files
    const seedsDir = __dirname;
    const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql'));

    for (const file of files) {
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`🟢 Running seed: ${file}`);
      await client.query(sql);
    }

    console.log('🎉 All seeds executed successfully!');
  } catch (err) {
    console.error('❌ Error running seeds:', err);
  } finally {
    await client.end();
    console.log('Connection closed.');
  }
}

runSeeds();
