require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pcsirweb',
    password: '123456',
    port: 5432,
});

async function updateMonofunctionalUnits() {
    try {
        // Update units to monofunctional
        const result = await pool.query(`
            UPDATE units 
            SET type = 'monofunctional' 
            WHERE id IN (6, 7, 8, 9)
            RETURNING id, name, type;
        `);

        console.log('✅ Updated units to monofunctional:');
        result.rows.forEach(row => {
            console.log(`  ID ${row.id}: ${row.name} → ${row.type}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateMonofunctionalUnits();
