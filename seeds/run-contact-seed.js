const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function runSeed() {
    try {
        console.log('Seeding contact info...');

        const seedSQL = fs.readFileSync(path.join(__dirname, '../seeds/014_contact_info.sql'), 'utf8');

        // Split by semicolon and filter out comments and empty lines
        const statements = seedSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--'));

        for (const statement of statements) {
            if (statement) {
                await db.query(statement);
            }
        }

        console.log('✓ Contact info seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding contact info:', error);
        process.exit(1);
    }
}

runSeed();
