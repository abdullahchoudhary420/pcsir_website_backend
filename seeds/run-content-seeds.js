const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function runSeeds() {
    try {
        console.log('Seeding scope areas...');
        const scopeSQL = fs.readFileSync(path.join(__dirname, '../seeds/015_scope_areas.sql'), 'utf8');
        const scopeStatements = scopeSQL.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--'));
        for (const statement of scopeStatements) {
            if (statement) await db.query(statement);
        }
        console.log('✓ Scope areas seeded');

        console.log('Seeding testing/training data...');
        const testingSQL = fs.readFileSync(path.join(__dirname, '../seeds/016_testing_training.sql'), 'utf8');
        const testingStatements = testingSQL.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--'));
        for (const statement of testingStatements) {
            if (statement) await db.query(statement);
        }
        console.log('✓ Testing/training data seeded');

        console.log('All content pages seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding content pages:', error);
        process.exit(1);
    }
}

runSeeds();
