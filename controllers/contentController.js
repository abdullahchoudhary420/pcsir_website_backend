const db = require('../config/db');

/**
 * Content Controller (Legacy)
 * Contains controllers that haven't been migrated to individual files yet.
 * 
 * Migrated controllers (see individual files):
 * - newsController.js
 * - infoCardsController.js
 * - statisticsController.js
 * - servicesController.js
 * - settingsController.js
 * - navbarController.js
 * - bannerController.js
 * - socialLinksController.js
 * - labsController.js
 */

// ============================================================================
// PROJECTS CONTROLLERS
// ============================================================================

exports.getProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM projects WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (search) {
            paramCount++;
            query += ` AND (title ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        // Get total count
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
        const countResult = await db.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        // Get paginated results
        query += ` ORDER BY id DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        res.json({
            data: result.rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ success: false, message: 'Error fetching projects' });
    }
};

exports.addProject = async (req, res) => {
    const { title, description, status, category, image, demand_by_pcsir, allocation, total_cost } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO projects (title, description, status, category, image, demand_by_pcsir, allocation, total_cost) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [title, description, status, category, image, demand_by_pcsir, allocation, total_cost]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding project:', err);
        res.status(500).json({ success: false, message: 'Error adding project' });
    }
};

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, description, status, category, image, demand_by_pcsir, allocation, total_cost } = req.body;
    try {
        const result = await db.query(
            `UPDATE projects SET 
                title = $1, description = $2, status = $3, category = $4, 
                image = $5, demand_by_pcsir = $6, allocation = $7, total_cost = $8 
             WHERE id = $9 RETURNING *`,
            [title, description, status, category, image, demand_by_pcsir, allocation, total_cost, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ success: false, message: 'Error updating project' });
    }
};

exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ success: false, message: 'Error deleting project' });
    }
};

// ============================================================================
// ABOUT ENTRIES CONTROLLERS
// ============================================================================

exports.getAboutEntries = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM about_entries WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (search) {
            paramCount++;
            query += ` AND (title ILIKE $${paramCount} OR content ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
        const countResult = await db.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        query += ` ORDER BY display_order ASC, id ASC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        res.json({
            data: result.rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error fetching about entries:', err);
        res.status(500).json({ success: false, message: 'Error fetching about entries' });
    }
};

exports.addAboutEntry = async (req, res) => {
    const { title, content, icon, display_order } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO about_entries (title, content, icon, display_order) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, content, icon, display_order || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding about entry:', err);
        res.status(500).json({ success: false, message: 'Error adding about entry' });
    }
};

exports.updateAboutEntry = async (req, res) => {
    const { id } = req.params;
    const { title, content, icon, display_order } = req.body;
    try {
        const result = await db.query(
            'UPDATE about_entries SET title = $1, content = $2, icon = $3, display_order = $4 WHERE id = $5 RETURNING *',
            [title, content, icon, display_order, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'About entry not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating about entry:', err);
        res.status(500).json({ success: false, message: 'Error updating about entry' });
    }
};

exports.deleteAboutEntry = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM about_entries WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'About entry not found' });
        }
        res.json({ success: true, message: 'About entry deleted successfully' });
    } catch (err) {
        console.error('Error deleting about entry:', err);
        res.status(500).json({ success: false, message: 'Error deleting about entry' });
    }
};

// ============================================================================
// PUBLICATIONS CONTROLLERS
// ============================================================================

exports.getPublications = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM publications WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (search) {
            paramCount++;
            query += ` AND (title ILIKE $${paramCount} OR authors ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
        const countResult = await db.query(countQuery, params);
        const total = parseInt(countResult.rows[0].count);

        query += ` ORDER BY year DESC, id DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        res.json({
            data: result.rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error fetching publications:', err);
        res.status(500).json({ success: false, message: 'Error fetching publications' });
    }
};

exports.addPublication = async (req, res) => {
    const { title, authors, journal, year, link, type, image } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO publications (title, authors, journal, year, link, type, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [title, authors, journal, year, link, type, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding publication:', err);
        res.status(500).json({ success: false, message: 'Error adding publication' });
    }
};

exports.deletePublication = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM publications WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Publication not found' });
        }
        res.json({ success: true, message: 'Publication deleted successfully' });
    } catch (err) {
        console.error('Error deleting publication:', err);
        res.status(500).json({ success: false, message: 'Error deleting publication' });
    }
};