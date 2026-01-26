const db = require('../config/db');

// ============================================================================
// LABS CONTROLLERS - Full CRUD
// ============================================================================

exports.getLabs = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM labs';
        let countQuery = 'SELECT COUNT(*) FROM labs';
        const params = [];
        const countParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            const searchClause = ' WHERE name ILIKE $1 OR location ILIKE $1';
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
        console.error('getLabs error:', error);
        res.status(500).json({ success: false, message: 'Error reading labs' });
    }
};

exports.addLab = async (req, res) => {
    try {
        const { name, location, description, image_url } = req.body;
        const result = await db.query(
            'INSERT INTO labs (name, location, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, location, description, image_url || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('addLab error:', error);
        res.status(500).json({ success: false, message: 'Error saving lab' });
    }
};

exports.updateLab = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, description, image_url } = req.body;
        const result = await db.query(
            'UPDATE labs SET name = $1, location = $2, description = $3, image_url = $4 WHERE id = $5 RETURNING *',
            [name, location, description, image_url || null, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Lab not found' });
        }
    } catch (error) {
        console.error('updateLab error:', error);
        res.status(500).json({ success: false, message: 'Error updating lab' });
    }
};

exports.deleteLab = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM labs WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Lab deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Lab not found' });
        }
    } catch (error) {
        console.error('deleteLab error:', error);
        res.status(500).json({ success: false, message: 'Error deleting lab' });
    }
};
