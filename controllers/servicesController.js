const db = require('../config/db');
const logger = require('../config/logger');

// ============================================================================
// SERVICES CONTROLLERS - Full CRUD with pagination and search
// ============================================================================

exports.getServices = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM services';
        let countQuery = 'SELECT COUNT(*) FROM services';
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
        logger.error('getServices error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error reading services' });
    }
};

exports.addService = async (req, res) => {
    try {
        const { title, description, icon, link, display_order } = req.body;
        const result = await db.query(
            'INSERT INTO services (title, description, icon, link, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, icon, link, display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('addService error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error saving service' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, icon, link, display_order } = req.body;
        const result = await db.query(
            'UPDATE services SET title = $1, description = $2, icon = $3, link = $4, display_order = $5 WHERE id = $6 RETURNING *',
            [title, description, icon, link, display_order, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Service not found' });
        }
    } catch (error) {
        logger.error('updateService error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error updating service' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Service deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Service not found' });
        }
    } catch (error) {
        logger.error('deleteService error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error deleting service' });
    }
};
