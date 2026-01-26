const db = require('../config/db');
const auditLogger = require('../utils/auditLogger');

// Get all advertisements (with optional category filter)
exports.getAdvertisements = async (req, res) => {
    try {
        const { category, is_active } = req.query;
        let query = 'SELECT * FROM advertisements WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (category) {
            query += ` AND category = $${paramCount}`;
            params.push(category);
            paramCount++;
        }

        if (is_active !== undefined) {
            query += ` AND is_active = $${paramCount}`;
            params.push(is_active === 'true');
            paramCount++;
        }

        query += ' ORDER BY display_order ASC, created_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        res.status(500).json({ message: 'Error fetching advertisements' });
    }
};

// Get single advertisement by ID
exports.getAdvertisementById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM advertisements WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching advertisement:', error);
        res.status(500).json({ message: 'Error fetching advertisement' });
    }
};

// Create advertisement
exports.createAdvertisement = async (req, res) => {
    try {
        const { category, title, description, deadline, link, is_active, display_order, file_url } = req.body;

        const result = await db.query(`
            INSERT INTO advertisements (category, title, description, deadline, link, is_active, display_order, file_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [category, title, description || '', deadline || null, link || '', is_active ?? true, display_order || 0, file_url || null]);

        const newRecord = result.rows[0];

        if (req.user) {
            await auditLogger.log(req, 'CREATE', 'advertisements', newRecord.id, null, newRecord);
        }

        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error creating advertisement:', error);
        res.status(500).json({ message: 'Error creating advertisement' });
    }
};

// Update advertisement
exports.updateAdvertisement = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, title, description, deadline, link, is_active, display_order, file_url } = req.body;

        // Old record
        const oldResult = await db.query('SELECT * FROM advertisements WHERE id = $1', [id]);
        if (oldResult.rows.length === 0) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }
        const oldRecord = oldResult.rows[0];

        const result = await db.query(`
            UPDATE advertisements SET 
                category = $1, 
                title = $2, 
                description = $3, 
                deadline = $4, 
                link = $5, 
                is_active = $6, 
                display_order = $7,
                file_url = $8,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *
        `, [category, title, description, deadline, link, is_active, display_order, file_url, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        const updatedRecord = result.rows[0];

        if (req.user) {
            await auditLogger.log(req, 'UPDATE', 'advertisements', id, oldRecord, updatedRecord);
        }

        res.json(updatedRecord);
    } catch (error) {
        console.error('Error updating advertisement:', error);
        res.status(500).json({ message: 'Error updating advertisement' });
    }
};

// Delete advertisement
exports.deleteAdvertisement = async (req, res) => {
    try {
        const { id } = req.params;

        // Old record
        const oldResult = await db.query('SELECT * FROM advertisements WHERE id = $1', [id]);
        if (oldResult.rows.length === 0) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }
        const oldRecord = oldResult.rows[0];

        const result = await db.query('DELETE FROM advertisements WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        if (req.user) {
            await auditLogger.log(req, 'DELETE', 'advertisements', id, oldRecord, null);
        }

        res.json({ message: 'Advertisement deleted successfully' });
    } catch (error) {
        console.error('Error deleting advertisement:', error);
        res.status(500).json({ message: 'Error deleting advertisement' });
    }
};
