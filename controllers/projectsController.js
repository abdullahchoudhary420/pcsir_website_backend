const db = require('../config/db');
const logger = require('../config/logger');
const auditLogger = require('../utils/auditLogger');

// ============================================================================
// PROJECTS CONTROLLERS - Full CRUD with pagination and search
// ============================================================================

exports.getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM projects';
        let countQuery = 'SELECT COUNT(*) FROM projects';
        const params = [];
        const countParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            const searchClause = ' WHERE title ILIKE $1 OR category ILIKE $1 OR status ILIKE $1 OR description ILIKE $1';
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
        logger.error('getProjects error:', { error: error.message });
        res.status(500).json({ message: 'Error reading data' });
    }
};

exports.addProject = async (req, res) => {
    try {
        const { title, category, status, description, duration, demand_by_pcsir, allocation, total_cost } = req.body;
        const result = await db.query(
            'INSERT INTO projects (title, category, status, description, duration, demand_by_pcsir, allocation, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, category, status, description, duration, demand_by_pcsir || null, allocation || null, total_cost || null]
        );
        const newRecord = result.rows[0];

        // Audit Log
        if (req.user) {
            await auditLogger.log(req, 'CREATE', 'projects', newRecord.id, null, newRecord);
        }

        res.status(201).json(newRecord);
    } catch (error) {
        logger.error('addProject error:', { error: error.message });
        res.status(500).json({ message: 'Error saving data' });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, status, description, duration, demand_by_pcsir, allocation, total_cost } = req.body;

        // Get old values for audit
        const oldRecordResult = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
        if (oldRecordResult.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const oldRecord = oldRecordResult.rows[0];

        const result = await db.query(
            'UPDATE projects SET title = $1, category = $2, status = $3, description = $4, duration = $5, demand_by_pcsir = $6, allocation = $7, total_cost = $8 WHERE id = $9 RETURNING *',
            [title, category, status, description, duration, demand_by_pcsir || null, allocation || null, total_cost || null, id]
        );

        const updatedRecord = result.rows[0];

        if (req.user) {
            await auditLogger.log(req, 'UPDATE', 'projects', id, oldRecord, updatedRecord);
        }

        res.json(updatedRecord);
    } catch (error) {
        logger.error('updateProject error:', { error: error.message });
        res.status(500).json({ message: 'Error updating data' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Get old values for audit
        const oldRecordResult = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
        if (oldRecordResult.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        const oldRecord = oldRecordResult.rows[0];

        const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            if (req.user) {
                await auditLogger.log(req, 'DELETE', 'projects', id, oldRecord, null);
            }
            res.json({ message: 'Project deleted' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        logger.error('deleteProject error:', { error: error.message });
        res.status(500).json({ message: 'Error deleting data' });
    }
};