const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function updateUnitTypes() {
    try {
        console.log('Updating unit types...');
        const sql = fs.readFileSync(path.join(__dirname, '../seeds/update_unit_types.sql'), 'utf8');
        const statements = sql.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--'));
        
        for (const statement of statements) {
            if (statement) await db.query(statement);
        }
        
        console.log('✓ Unit types updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error updating unit types:', error);
        process.exit(1);
    }
}

updateUnitTypes();
