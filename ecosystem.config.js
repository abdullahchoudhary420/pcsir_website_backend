/**
 * PM2 Ecosystem Configuration
 * Production process management for PCSIR Backend
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 start ecosystem.config.js --env production
 */
module.exports = {
    apps: [{
        name: 'pcsir-backend',
        script: 'server.js',

        // Clustering: Use all available CPUs
        instances: 'max',
        exec_mode: 'cluster',

        // Auto-restart on failure
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',

        // Environment variables
        env: {
            NODE_ENV: 'development',
            PORT: 5001
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 5021
        },

        // Logging configuration
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        error_file: './logs/pm2-error.log',
        out_file: './logs/pm2-out.log',
        merge_logs: true,

        // Graceful shutdown
        kill_timeout: 5000,
        listen_timeout: 8000,

        // Health monitoring
        max_restarts: 10,
        min_uptime: '10s'
    }]
};
