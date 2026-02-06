#!/usr/bin/env node
/**
 * Environment Variable Validation Script
 * Run before server start to ensure all required variables are set
 */

const requiredEnvVars = [
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_PORT',
    'DB_DATABASE',
    'JWT_SECRET',
    'PORT'
];

const optionalEnvVars = [
    'NODE_ENV',
    'CORS_ORIGINS',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'CONTACT_FORM_TO'
];

const missing = [];
const warnings = [];

// Check required variables
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        missing.push(envVar);
    }
});

// Warn about optional variables
optionalEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        warnings.push(envVar);
    }
});

// Report results
if (missing.length > 0) {
    console.error('\n❌ FATAL: Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease set these in your .env file before starting the server.\n');
    process.exit(1);
}

if (warnings.length > 0) {
    console.warn('\n⚠️  Optional environment variables not set (may have defaults):');
    warnings.forEach(v => console.warn(`   - ${v}`));
}

console.log('\n✅ Environment validation passed!\n');
process.exit(0);
