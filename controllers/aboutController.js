const db = require('../config/db');

exports.getHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM history_entries';
        let countQuery = 'SELECT COUNT(*) FROM history_entries';
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

        query += ` ORDER BY year DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
        console.error('getHistory error:', error);
        res.status(500).json({ message: 'Error reading history entries' });
    }
};

exports.addHistoryEntry = async (req, res) => {
    try {
        const { title, description, year } = req.body;
        const result = await db.query(
            'INSERT INTO history_entries (title, description, year) VALUES ($1, $2, $3) RETURNING *',
            [title, description, year]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('addHistoryEntry error:', error);
        res.status(500).json({ message: 'Error saving history entry' });
    }
};

exports.updateHistoryEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, year } = req.body;
        const result = await db.query(
            'UPDATE history_entries SET title = $1, description = $2, year = $3 WHERE id = $4 RETURNING *',
            [title, description, year, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'History entry not found' });
        }
    } catch (error) {
        console.error('updateHistoryEntry error:', error);
        res.status(500).json({ message: 'Error updating history entry' });
    }
};

exports.deleteHistoryEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM history_entries WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ message: 'History entry deleted' });
        } else {
            res.status(404).json({ message: 'History entry not found' });
        }
    } catch (error) {
        console.error('deleteHistoryEntry error:', error);
        res.status(500).json({ message: 'Error deleting history entry' });
    }
};

// ============================================================================
// OBJECTIVES CONTROLLERS
// ============================================================================

exports.getObjectives = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM objectives_entries';
        let countQuery = 'SELECT COUNT(*) FROM objectives_entries';
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

        query += ` ORDER BY num ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
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
        console.error('getObjectives error:', error);
        res.status(500).json({ message: 'Error reading objectives' });
    }
};

exports.addObjective = async (req, res) => {
    try {
        const { num, title, description } = req.body;
        const result = await db.query(
            'INSERT INTO objectives_entries (num, title, description) VALUES ($1, $2, $3) RETURNING *',
            [num, title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('addObjective error:', error);
        res.status(500).json({ message: 'Error saving objective' });
    }
};

exports.updateObjective = async (req, res) => {
    try {
        const { id } = req.params;
        const { num, title, description } = req.body;
        const result = await db.query(
            'UPDATE objectives_entries SET num = $1, title = $2, description = $3 WHERE id = $4 RETURNING *',
            [num, title, description, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Objective not found' });
        }
    } catch (error) {
        console.error('updateObjective error:', error);
        res.status(500).json({ message: 'Error updating objective' });
    }
};

exports.deleteObjective = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM objectives_entries WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ message: 'Objective deleted' });
        } else {
            res.status(404).json({ message: 'Objective not found' });
        }
    } catch (error) {
        console.error('deleteObjective error:', error);
        res.status(500).json({ message: 'Error deleting objective' });
    }
};

// ============================================================================
// ACHIEVEMENTS CONTROLLERS
// ============================================================================

exports.getAchievements = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM achievements_entries';
        let countQuery = 'SELECT COUNT(*) FROM achievements_entries';
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
        console.error('getAchievements error:', error);
        res.status(500).json({ message: 'Error reading achievements' });
    }
};

exports.addAchievement = async (req, res) => {
    try {
        const { title, description, icon } = req.body;
        const result = await db.query(
            'INSERT INTO achievements_entries (title, description, icon) VALUES ($1, $2, $3) RETURNING *',
            [title, description, icon || '🏆']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('addAchievement error:', error);
        res.status(500).json({ message: 'Error saving achievement' });
    }
};

exports.updateAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, icon } = req.body;
        const result = await db.query(
            'UPDATE achievements_entries SET title = $1, description = $2, icon = $3 WHERE id = $4 RETURNING *',
            [title, description, icon, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Achievement not found' });
        }
    } catch (error) {
        console.error('updateAchievement error:', error);
        res.status(500).json({ message: 'Error updating achievement' });
    }
};

exports.deleteAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM achievements_entries WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ message: 'Achievement deleted' });
        } else {
            res.status(404).json({ message: 'Achievement not found' });
        }
    } catch (error) {
        console.error('deleteAchievement error:', error);
        res.status(500).json({ message: 'Error deleting achievement' });
    }
};