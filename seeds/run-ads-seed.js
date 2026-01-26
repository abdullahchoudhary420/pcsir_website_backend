const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function seedAdvertisements() {
    try {
        console.log('Seeding advertisements...');
        const sql = fs.readFileSync(path.join(__dirname, '../seeds/017_advertisements.sql'), 'utf8');
        const statements = sql.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--'));

        for (const statement of statements) {
            if (statement) await db.query(statement);
        }

        console.log('✓ Advertisements seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding advertisements:', error);
        process.exit(1);
    }
}

seedAdvertisements();
