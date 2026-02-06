const db = require('../config/db');
const logger = require('../config/logger');

/**
 * Log an administrative action
 * @param {Object} req - The express request object (contains user info)
 * @param {string} action - The action performed (CREATE, UPDATE, DELETE, PUBLISH, UNPUBLISH)
 * @param {string} tableName - The table affected
 * @param {number} recordId - The ID of the record affected
 * @param {Object} oldValues - Previous state (for updates)
 * @param {Object} newValues - New state
 */
exports.log = async (req, action, tableName, recordId, oldValues = null, newValues = null) => {
    try {
        const userId = req.user ? req.user.id : null;
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        await db.query(
            `INSERT INTO audit_logs 
            (user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [userId, action, tableName, recordId, oldValues, newValues, ipAddress, userAgent]
        );
    } catch (error) {
        logger.error('Audit log error', { error: error.message });
        // Don't block the main request flow if logging fails
    }
};
