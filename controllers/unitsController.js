const db = require('../config/db');
const logger = require('../config/logger');
const auditLogger = require('../utils/auditLogger');

// ============================================================================
// UNITS CONTROLLERS - Full CRUD with pagination and search
// ============================================================================

exports.getUnits = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM units';
        let countQuery = 'SELECT COUNT(*) FROM units';
        const params = [];
        const countParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            const searchClause = ' WHERE name ILIKE $1 OR location ILIKE $1 OR specialization ILIKE $1';
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
        logger.error('getUnits error:', { error: error.message });
        res.status(500).json({ message: 'Error reading units' });
    }
};

exports.getUnitById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM units WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        logger.error('getUnitById error:', { error: error.message });
        res.status(500).json({ message: 'Error fetching unit details' });
    }
};

exports.addUnit = async (req, res) => {
    try {
        const { name, location, specialization, phone, email, image_url, type, description } = req.body;
        const result = await db.query(
            'INSERT INTO units (name, location, specialization, phone, email, image_url, type, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, location, specialization, phone, email, image_url, type || 'multifunctional', description || '']
        );
        const newRecord = result.rows[0];

        if (req.user) {
            await auditLogger.log(req, 'CREATE', 'units', newRecord.id, null, newRecord);
        }

        res.status(201).json(newRecord);
    } catch (error) {
        logger.error('addUnit error:', { error: error.message });
        res.status(500).json({ message: 'Error saving unit' });
    }
};

exports.updateUnit = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, specialization, phone, email, image_url, type, description } = req.body;

        // Old record
        const oldResult = await db.query('SELECT * FROM units WHERE id = $1', [id]);
        if (oldResult.rows.length === 0) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        const oldRecord = oldResult.rows[0];

        const result = await db.query(
            'UPDATE units SET name = $1, location = $2, specialization = $3, phone = $4, email = $5, image_url = $6, type = $7, description = $8 WHERE id = $9 RETURNING *',
            [name, location, specialization, phone, email, image_url, type || 'multifunctional', description || '', id]
        );

        const updatedRecord = result.rows[0];

        if (req.user) {
            await auditLogger.log(req, 'UPDATE', 'units', id, oldRecord, updatedRecord);
        }

        res.json(updatedRecord);
    } catch (error) {
        logger.error('updateUnit error:', { error: error.message });
        res.status(500).json({ message: 'Error updating unit' });
    }
};

exports.deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;

        // Old record
        const oldResult = await db.query('SELECT * FROM units WHERE id = $1', [id]);
        if (oldResult.rows.length === 0) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        const oldRecord = oldResult.rows[0];

        const result = await db.query('DELETE FROM units WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            if (req.user) {
                await auditLogger.log(req, 'DELETE', 'units', id, oldRecord, null);
            }
            res.json({ message: 'Unit deleted' });
        } else {
            res.status(404).json({ message: 'Unit not found' });
        }
    } catch (error) {
        logger.error('deleteUnit error:', { error: error.message });
        res.status(500).json({ message: 'Error deleting unit' });
    }
};