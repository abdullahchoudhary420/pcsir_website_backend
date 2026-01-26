const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// ============================================================================
// NEWS CONTROLLERS - Full CRUD with pagination and search
// ============================================================================

exports.getNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM news';
        let countQuery = 'SELECT COUNT(*) FROM news';
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
        console.error('getNews error:', error);
        res.status(500).json({ success: false, message: 'Error reading news' });
    }
};

exports.addNews = async (req, res) => {
    try {
        const { date, title, description, image_url } = req.body;
        const result = await db.query(
            'INSERT INTO news (date, title, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [date, title, description, image_url || null]
        );
        const newRecord = result.rows[0];

        // Audit Log
        if (req.user) {
            await auditLogger.log(req, 'CREATE', 'news', newRecord.id, null, newRecord);
        }

        res.status(201).json(newRecord);
    } catch (error) {
        console.error('addNews error:', error);
        res.status(500).json({ success: false, message: 'Error saving news' });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, title, description, image_url } = req.body;

        // Get old record
        const oldRecordResult = await db.query('SELECT * FROM news WHERE id = $1', [id]);
        if (oldRecordResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'News item not found' });
        }
        const oldRecord = oldRecordResult.rows[0];

        const result = await db.query(
            'UPDATE news SET date = $1, title = $2, description = $3, image_url = $4 WHERE id = $5 RETURNING *',
            [date, title, description, image_url || null, id]
        );

        const updatedRecord = result.rows[0];

        if (req.user) {
            await auditLogger.log(req, 'UPDATE', 'news', id, oldRecord, updatedRecord);
        }

        res.json(updatedRecord);
    } catch (error) {
        console.error('updateNews error:', error);
        res.status(500).json({ success: false, message: 'Error updating news' });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        // Get old record
        const oldRecordResult = await db.query('SELECT * FROM news WHERE id = $1', [id]);
        if (oldRecordResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'News item not found' });
        }
        const oldRecord = oldRecordResult.rows[0];

        const result = await db.query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            if (req.user) {
                await auditLogger.log(req, 'DELETE', 'news', id, oldRecord, null);
            }
            res.json({ success: true, message: 'News item deleted' });
        } else {
            res.status(404).json({ success: false, message: 'News item not found' });
        }
    } catch (error) {
        console.error('deleteNews error:', error);
        res.status(500).json({ success: false, message: 'Error deleting news' });
    }
};
