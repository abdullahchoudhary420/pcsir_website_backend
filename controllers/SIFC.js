const db = require('../config/db');
const logger = require('../config/logger');

exports.getSIFCItems = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sifc_items ORDER BY display_order ASC, id ASC');
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching SIFC items:', { error: error.message });
        res.status(500).json({ message: 'Error fetching SIFC items' });
    }
};

exports.createSIFCItem = async (req, res) => {
    try {
        const { title, description, category, display_order } = req.body;
        const result = await db.query(`
            INSERT INTO sifc_items (title, description, category, display_order)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [title, description, category || 'focus_area', display_order || 0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error creating SIFC item:', { error: error.message });
        res.status(500).json({ message: 'Error creating SIFC item' });
    }
};

exports.updateSIFCItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, display_order } = req.body;
        const result = await db.query(`
            UPDATE sifc_items SET 
                title = $1, 
                description = $2, 
                category = $3, 
                display_order = $4
            WHERE id = $5
            RETURNING *
        `, [title, description, category, display_order, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'SIFC item not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error updating SIFC item:', { error: error.message });
        res.status(500).json({ message: 'Error updating SIFC item' });
    }
};

exports.deleteSIFCItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM sifc_items WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'SIFC item not found' });
        }
        res.json({ message: 'SIFC item deleted successfully' });
    } catch (error) {
        logger.error('Error deleting SIFC item:', { error: error.message });
        res.status(500).json({ message: 'Error deleting SIFC item' });
    }
};