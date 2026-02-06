const db = require('../config/db');
const logger = require('../config/logger');
const auditLogger = require('../utils/auditLogger');

// ============================================================================
// PUBLICATIONS CONTROLLERS - Full CRUD with pagination and search
// ============================================================================

exports.getPublications = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM publications WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) FROM publications WHERE 1=1';
        const params = [];
        const countParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            params.push(searchPattern);
            countParams.push(searchPattern);
            const searchClause = ` AND (title ILIKE $${params.length} OR type ILIKE $${params.length} OR year ILIKE $${params.length})`;
            query += searchClause;
            countQuery += searchClause;
        }

        query += ` ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
        logger.error('getPublications error:', { error: error.message });
        res.status(500).json({ message: 'Error reading publications' });
    }
};

exports.addPublication = async (req, res) => {
    try {
        const { title, type, year, link, cover_image } = req.body;

        const result = await db.query(
            'INSERT INTO publications (title, type, year, link, cover_image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, type, year, link, cover_image]
        );

        const newRecord = result.rows[0];

        // Audit Log
        if (req.user) {
            await auditLogger.log(req, 'CREATE', 'publications', newRecord.id, null, newRecord);
        }

        res.status(201).json(newRecord);
    } catch (error) {
        logger.error('addPublication error:', { error: error.message });
        res.status(500).json({ message: 'Error saving publication' });
    }
};

exports.updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, type, year, link, cover_image } = req.body;

        // Get old values for audit
        const oldRecordResult = await db.query('SELECT * FROM publications WHERE id = $1', [id]);
        if (oldRecordResult.rows.length === 0) {
            return res.status(404).json({ message: 'Publication not found' });
        }
        const oldRecord = oldRecordResult.rows[0];

        const result = await db.query(
            'UPDATE publications SET title = $1, type = $2, year = $3, link = $4, cover_image = $5 WHERE id = $6 RETURNING *',
            [title, type, year, link, cover_image || oldRecord.cover_image, id]
        );

        const updatedRecord = result.rows[0];

        // Audit Log
        if (req.user) {
            await auditLogger.log(req, 'UPDATE', 'publications', id, oldRecord, updatedRecord);
        }

        res.json(updatedRecord);
    } catch (error) {
        logger.error('updatePublication error:', { error: error.message });
        res.status(500).json({ message: 'Error updating publication' });
    }
};

exports.deletePublication = async (req, res) => {
    try {
        const { id } = req.params;

        // Get old values for audit
        const oldRecordResult = await db.query('SELECT * FROM publications WHERE id = $1', [id]);
        if (oldRecordResult.rows.length === 0) {
            return res.status(404).json({ message: 'Publication not found' });
        }
        const oldRecord = oldRecordResult.rows[0];

        const result = await db.query('DELETE FROM publications WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            // Audit Log
            if (req.user) {
                await auditLogger.log(req, 'DELETE', 'publications', id, oldRecord, null);
            }
            res.json({ message: 'Publication deleted' });
        } else {
            res.status(404).json({ message: 'Publication not found' });
        }
    } catch (error) {
        logger.error('deletePublication error:', { error: error.message });
        res.status(500).json({ message: 'Error deleting publication' });
    }
};