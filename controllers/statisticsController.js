const db = require('../config/db');
const logger = require('../config/logger');

// ============================================================================
// STATISTICS CONTROLLERS - Full CRUD with pagination and search
// ============================================================================

exports.getStatistics = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM statistics';
        let countQuery = 'SELECT COUNT(*) FROM statistics';
        const params = [];
        const countParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            const searchClause = ' WHERE label ILIKE $1 OR value ILIKE $1';
            query += searchClause;
            countQuery += searchClause;
            params.push(searchPattern);
            countParams.push(searchPattern);
        }

        query += ` ORDER BY display_order ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
        logger.error('getStatistics error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error reading statistics' });
    }
};

exports.addStatistic = async (req, res) => {
    try {
        const { value, label, display_order } = req.body;
        const result = await db.query(
            'INSERT INTO statistics (value, label, display_order) VALUES ($1, $2, $3) RETURNING *',
            [value, label, display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('addStatistic error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error saving statistic' });
    }
};

exports.updateStatistic = async (req, res) => {
    try {
        const { id } = req.params;
        const { value, label, display_order } = req.body;
        const result = await db.query(
            'UPDATE statistics SET value = $1, label = $2, display_order = $3 WHERE id = $4 RETURNING *',
            [value, label, display_order, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Statistic not found' });
        }
    } catch (error) {
        logger.error('updateStatistic error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error updating statistic' });
    }
};

exports.deleteStatistic = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM statistics WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Statistic deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Statistic not found' });
        }
    } catch (error) {
        logger.error('deleteStatistic error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error deleting statistic' });
    }
};
