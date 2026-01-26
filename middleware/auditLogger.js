const db = require('../config/db');

/**
 * Audit logging middleware
 * Logs admin actions to the audit_logs table
 */

/**
 * Log an action to the audit trail
 * @param {Object} options - Audit log options
 * @param {number} options.userId - User ID performing the action
 * @param {string} options.action - Action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
 * @param {string} options.tableName - Table being modified
 * @param {number} options.recordId - ID of the record being modified
 * @param {Object} options.oldValues - Previous values (for UPDATE/DELETE)
 * @param {Object} options.newValues - New values (for CREATE/UPDATE)
 * @param {string} options.ipAddress - Client IP address
 * @param {string} options.userAgent - Client user agent
 */
const logAudit = async ({
    userId,
    action,
    tableName,
    recordId = null,
    oldValues = null,
    newValues = null,
    ipAddress = null,
    userAgent = null
}) => {
    try {
        await db.query(`
            INSERT INTO audit_logs 
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            userId,
            action,
            tableName,
            recordId,
            oldValues ? JSON.stringify(oldValues) : null,
            newValues ? JSON.stringify(newValues) : null,
            ipAddress,
            userAgent
        ]);
    } catch (error) {
        // Don't fail the request if audit logging fails
        console.error('Audit logging error:', error);
    }
};

/**
 * Middleware to automatically log actions
 * Attach to routes that need auditing
 * 
 * @param {string} action - Action type
 * @param {string} tableName - Table being modified
 */
const auditMiddleware = (action, tableName) => {
    return (req, res, next) => {
        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json to capture response
        res.json = (data) => {
            // Log successful operations
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                logAudit({
                    userId: req.user.id,
                    action: action,
                    tableName: tableName,
                    recordId: req.params.id || data?.id || null,
                    oldValues: req.body._oldValues || null,
                    newValues: req.body,
                    ipAddress: req.ip || req.connection?.remoteAddress,
                    userAgent: req.get('User-Agent')
                });
            }

            // Call original json method
            return originalJson(data);
        };

        next();
    };
};

/**
 * Action types for consistency
 */
const ACTIONS = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    VIEW: 'VIEW',
    EXPORT: 'EXPORT'
};

module.exports = {
    logAudit,
    auditMiddleware,
    ACTIONS
};
