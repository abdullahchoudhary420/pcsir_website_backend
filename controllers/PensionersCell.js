
const db = require('../config/db');

exports.getPensionersCellItems = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM pensioners_cell_items ORDER BY display_order ASC, id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching Pensioners Cell items:', error);
        res.status(500).json({ message: 'Error fetching Pensioners Cell items' });
    }
};

exports.createPensionersCellItem = async (req, res) => {
    try {
        const { title, description, contact_person, contact_email, contact_phone, display_order, category } = req.body;
        const result = await db.query(`
            INSERT INTO pensioners_cell_items (title, description, contact_person, contact_email, contact_phone, display_order, category)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [title, description, contact_person || null, contact_email || null, contact_phone || null, display_order || 0, category || 'general_info']);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating Pensioners Cell item:', error);
        res.status(500).json({ message: 'Error creating Pensioners Cell item' });
    }
};

exports.updatePensionersCellItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, contact_person, contact_email, contact_phone, display_order, category } = req.body;
        const result = await db.query(`
            UPDATE pensioners_cell_items SET 
                title = $1, 
                description = $2, 
                contact_person = $3, 
                contact_email = $4, 
                contact_phone = $5, 
                display_order = $6,
                category = $7
            WHERE id = $8
            RETURNING *
        `, [title, description, contact_person, contact_email, contact_phone, display_order, category, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pensioners Cell item not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating Pensioners Cell item:', error);
        res.status(500).json({ message: 'Error updating Pensioners Cell item' });
    }
};

exports.deletePensionersCellItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM pensioners_cell_items WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pensioners Cell item not found' });
        }
        res.json({ message: 'Pensioners Cell item deleted successfully' });
    } catch (error) {
        console.error('Error deleting Pensioners Cell item:', error);
        res.status(500).json({ message: 'Error deleting Pensioners Cell item' });
    }
};