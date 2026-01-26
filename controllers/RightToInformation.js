const db = require('../config/db');

exports.getRTIItems = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM right_to_information_items ORDER BY display_order ASC, id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching RTI items:', error);
        res.status(500).json({ message: 'Error fetching RTI items' });
    }
};

exports.createRTIItem = async (req, res) => {
    try {
        const { title, description, document_url, category, display_order } = req.body;
        const result = await db.query(`
            INSERT INTO right_to_information_items (title, description, document_url, category, display_order)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [title, description, document_url || null, category || 'document', display_order || 0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating RTI item:', error);
        res.status(500).json({ message: 'Error creating RTI item' });
    }
};

exports.updateRTIItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, document_url, category, display_order } = req.body;
        const result = await db.query(`
            UPDATE right_to_information_items SET 
                title = $1, 
                description = $2, 
                document_url = $3, 
                category = $4, 
                display_order = $5
            WHERE id = $6
            RETURNING *
        `, [title, description, document_url, category, display_order, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'RTI item not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating RTI item:', error);
        res.status(500).json({ message: 'Error updating RTI item' });
    }
};

exports.deleteRTIItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM right_to_information_items WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'RTI item not found' });
        }
        res.json({ message: 'RTI item deleted successfully' });
    } catch (error) {
        console.error('Error deleting RTI item:', error);
        res.status(500).json({ message: 'Error deleting RTI item' });
    }
};
