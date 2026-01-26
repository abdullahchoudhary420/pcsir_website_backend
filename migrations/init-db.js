#!/usr/bin/env node
/**
 * Database Initialization & Migration Runner
 * 
 * Usage:
 *   node init-db.js           - Run all pending migrations
 *   node init-db.js status    - Show migration status
 *   node init-db.js seed      - Run seed files
 *   node init-db.js reset     - Reset tracking (run all migrations fresh)
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const db = require('../config/db');

const MIGRATIONS_DIR = __dirname;
const SEEDS_DIR = path.join(__dirname, '../seeds');

// =============================================================================
// MIGRATION TRACKING
// =============================================================================

/**
 * Ensure migrations tracking table exists
 */
async function ensureMigrationsTable() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

/**
 * Get list of executed migrations
 */
async function getExecutedMigrations() {
    try {
        const result = await db.query('SELECT name FROM migrations ORDER BY name');
        return result.rows.map(row => row.name);
    } catch (error) {
        // Table might not exist yet
        return [];
    }
}

/**
 * Record migration as executed
 */
async function recordMigration(filename) {
    await db.query('INSERT INTO migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [filename]);
}

/**
 * Reset migration tracking
 */
async function resetMigrationTracking() {
    await db.query('DROP TABLE IF EXISTS migrations');
    console.log('  Migration tracking reset.');
}

// =============================================================================
// MIGRATION RUNNER
// =============================================================================

/**
 * Get all migration files (both .sql and .js)
 */
async function getMigrationFiles() {
    const files = await fs.readdir(MIGRATIONS_DIR);
    return files
        .filter(f => (f.endsWith('.sql') || f.endsWith('.js')) && f !== 'init-db.js')
        .sort();
}

/**
 * Run a single migration
 */
async function runMigration(filename) {
    const filepath = path.join(MIGRATIONS_DIR, filename);

    if (filename.endsWith('.sql')) {
        // SQL migration
        const sql = await fs.readFile(filepath, 'utf8');
        await db.query(sql);
    } else if (filename.endsWith('.js')) {
        // JavaScript migration
        const migration = require(filepath);
        if (typeof migration.up === 'function') {
            await migration.up(db);
        } else if (typeof migration === 'function') {
            await migration(db);
        }
    }

    // Record migration as executed
    await recordMigration(filename);
}

/**
 * Run all pending migrations
 */
async function runMigrations(forceAll = false) {
    await ensureMigrationsTable();

    const executed = forceAll ? [] : await getExecutedMigrations();
    const allMigrations = await getMigrationFiles();
    const pending = allMigrations.filter(m => !executed.includes(m));

    if (pending.length === 0) {
        console.log('✅ All migrations are up to date!');
        return;
    }

    console.log(`\n🚀 Running ${pending.length} pending migration(s)...\n`);

    for (const migration of pending) {
        console.log(`  Running: ${migration}...`);
        try {
            await runMigration(migration);
            console.log(`  ✅ Completed: ${migration}`);
        } catch (error) {
            console.error(`  ❌ Failed: ${migration}`);
            throw error;
        }
    }

    console.log('\n✅ All migrations completed successfully!\n');
}

// =============================================================================
// SEED RUNNER
// =============================================================================

/**
 * Run seed files
 */
async function runSeeds() {
    try {
        const seedFiles = await fs.readdir(SEEDS_DIR);
        const sqlSeeds = seedFiles.filter(f => f.endsWith('.sql')).sort();

        if (sqlSeeds.length === 0) {
            console.log('No seed files found.');
            return;
        }

        console.log(`\n🌱 Running ${sqlSeeds.length} seed file(s)...\n`);

        for (const file of sqlSeeds) {
            console.log(`  Seeding: ${file}...`);
            const sql = await fs.readFile(path.join(SEEDS_DIR, file), 'utf8');
            await db.query(sql);
            console.log(`  ✅ Completed: ${file}`);
        }

        console.log('\n✅ Database seeding completed!\n');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('Seeds directory not found. Skipping seeds.');
        } else {
            throw error;
        }
    }
}

// =============================================================================
// STATUS DISPLAY
// =============================================================================

/**
 * Show migration status
 */
async function showStatus() {
    await ensureMigrationsTable();

    const executed = await getExecutedMigrations();
    const allMigrations = await getMigrationFiles();
    const pending = allMigrations.filter(m => !executed.includes(m));

    console.log('\n📊 Migration Status\n');
    console.log('─'.repeat(50));

    console.log('\n✅ Executed:');
    if (executed.length === 0) {
        console.log('  (none)');
    } else {
        executed.forEach(m => console.log(`  ✓ ${m}`));
    }

    console.log('\n⏳ Pending:');
    if (pending.length === 0) {
        console.log('  (none)');
    } else {
        pending.forEach(m => console.log(`  ○ ${m}`));
    }

    console.log('\n─'.repeat(50));
    console.log(`Total: ${allMigrations.length} | Executed: ${executed.length} | Pending: ${pending.length}\n`);
}

// =============================================================================
// MAIN ENTRY POINT
// =============================================================================

async function main() {
    const command = process.argv[2];

    try {
        switch (command) {
            case 'status':
                await showStatus();
                break;

            case 'seed':
                await runSeeds();
                break;

            case 'reset':
                console.log('\n⚠️  Resetting migration tracking...');
                await resetMigrationTracking();
                console.log('Running all migrations fresh...\n');
                await runMigrations(true);
                break;

            case 'help':
            case '--help':
            case '-h':
                console.log(`
Database Initialization & Migration Runner

Usage:
  node init-db.js           Run all pending migrations
  node init-db.js status    Show migration status
  node init-db.js seed      Run seed files
  node init-db.js reset     Reset tracking and run all migrations fresh
  node init-db.js help      Show this help message
`);
                break;

            default:
                // Default: run migrations
                await runMigrations();
                break;
        }

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
