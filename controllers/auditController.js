const db = require('../config/db');
const logger = require('../config/logger');

exports.getLogs = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT a.*, u.username as performed_by
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) FROM audit_logs WHERE 1=1';
        const params = [];
        const countParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            params.push(searchPattern);
            countParams.push(searchPattern);
            const searchClause = ` AND (a.action ILIKE $${params.length} OR a.table_name ILIKE $${params.length})`;
            query += searchClause;
            countQuery += searchClause;
        }

        query += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));

        const [dataResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query(countQuery, countParams)
        ]);

        const total = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(total / limit);

        res.json({
            data: dataResult.rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages
            }
        });
    } catch (error) {
        logger.error('getLogs error:', { error: error.message });
        res.status(500).json({ message: 'Error fetching audit logs' });
    }
};
