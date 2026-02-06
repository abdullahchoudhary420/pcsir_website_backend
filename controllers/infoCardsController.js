const db = require('../config/db');
const logger = require('../config/logger');

// ============================================================================
// INFO CARDS CONTROLLERS - Full CRUD with pagination and search
// ============================================================================

exports.getInfoCards = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM info_cards';
        let countQuery = 'SELECT COUNT(*) FROM info_cards';
        const params = [];
        const countParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            const searchClause = ' WHERE title ILIKE $1 OR description ILIKE $1';
            query += searchClause;
            countQuery += searchClause;
            params.push(searchPattern);
            countParams.push(searchPattern);
        }

        query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
        logger.error('getInfoCards error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error reading info cards' });
    }
};

exports.addInfoCard = async (req, res) => {
    try {
        const { icon, type, title, description, image_url } = req.body;
        const result = await db.query(
            'INSERT INTO info_cards (icon, type, title, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [icon, type || 'Standard', title, description, image_url || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('addInfoCard error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error saving info card' });
    }
};

exports.updateInfoCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { icon, type, title, description, image_url } = req.body;
        const result = await db.query(
            'UPDATE info_cards SET icon = $1, type = $2, title = $3, description = $4, image_url = $5 WHERE id = $6 RETURNING *',
            [icon, type || 'Standard', title, description, image_url || null, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Info card not found' });
        }
    } catch (error) {
        logger.error('updateInfoCard error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error updating info card' });
    }
};

exports.deleteInfoCard = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM info_cards WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Info card deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Info card not found' });
        }
    } catch (error) {
        logger.error('deleteInfoCard error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error deleting info card' });
    }
};
