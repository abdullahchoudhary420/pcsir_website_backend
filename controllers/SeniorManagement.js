const db = require('../config/db');
const logger = require('../config/logger');

exports.getSeniorManagement = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM senior_management ORDER BY display_order ASC, id ASC');
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching Senior Management:', { error: error.message });
        res.status(500).json({ message: 'Error fetching Senior Management' });
    }
};

exports.createSeniorManagementMember = async (req, res) => {
    try {
        const { name, designation, bio, image_url, email, phone, display_order, is_chairman } = req.body;

        // Check if trying to create chairman and one already exists
        if (is_chairman) {
            const chairmanCheck = await db.query('SELECT id FROM senior_management WHERE is_chairman = TRUE');
            if (chairmanCheck.rows.length > 0) {
                return res.status(400).json({ message: 'A chairman already exists. Only one chairman is allowed.' });
            }
        }

        const result = await db.query(`
            INSERT INTO senior_management (name, designation, bio, image_url, email, phone, display_order, is_chairman)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [name, designation, bio || null, image_url || null, email || null, phone || null, display_order || 0, is_chairman || false]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error creating Senior Management member:', { error: error.message });
        res.status(500).json({ message: 'Error creating Senior Management member' });
    }
};

exports.updateSeniorManagementMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, designation, bio, image_url, email, phone, display_order, is_chairman } = req.body;

        // Check if trying to set as chairman and another chairman exists
        if (is_chairman) {
            const chairmanCheck = await db.query('SELECT id FROM senior_management WHERE is_chairman = TRUE AND id != $1', [id]);
            if (chairmanCheck.rows.length > 0) {
                return res.status(400).json({ message: 'A chairman already exists. Only one chairman is allowed.' });
            }
        }

        const result = await db.query(`
            UPDATE senior_management SET 
                name = $1, 
                designation = $2, 
                bio = $3, 
                image_url = $4, 
                email = $5, 
                phone = $6, 
                display_order = $7,
                is_chairman = $8
            WHERE id = $9
            RETURNING *
        `, [name, designation, bio, image_url, email, phone, display_order, is_chairman || false, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Senior Management member not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error updating Senior Management member:', { error: error.message });
        res.status(500).json({ message: 'Error updating Senior Management member' });
    }
};

exports.deleteSeniorManagementMember = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM senior_management WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Senior Management member not found' });
        }
        res.json({ message: 'Senior Management member deleted successfully' });
    } catch (error) {
        logger.error('Error deleting Senior Management member:', { error: error.message });
        res.status(500).json({ message: 'Error deleting Senior Management member' });
    }
};
