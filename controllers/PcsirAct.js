const db = require('../config/db');

exports.getPCSIRActItems = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM pcsir_act_items ORDER BY display_order ASC, id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching PCSIR Act items:', error);
        res.status(500).json({ message: 'Error fetching PCSIR Act items' });
    }
};

exports.createPCSIRActItem = async (req, res) => {
    try {
        const { title, content, document_url, display_order } = req.body;
        const result = await db.query(`
            INSERT INTO pcsir_act_items (title, content, document_url, display_order)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [title, content, document_url || null, display_order || 0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating PCSIR Act item:', error);
        res.status(500).json({ message: 'Error creating PCSIR Act item' });
    }
};

exports.updatePCSIRActItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, document_url, display_order } = req.body;
        const result = await db.query(`
            UPDATE pcsir_act_items SET 
                title = $1, 
                content = $2, 
                document_url = $3, 
                display_order = $4
            WHERE id = $5
            RETURNING *
        `, [title, content, document_url, display_order, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'PCSIR Act item not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating PCSIR Act item:', error);
        res.status(500).json({ message: 'Error updating PCSIR Act item' });
    }
};

exports.deletePCSIRActItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM pcsir_act_items WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'PCSIR Act item not found' });
        }
        res.json({ message: 'PCSIR Act item deleted successfully' });
    } catch (error) {
        console.error('Error deleting PCSIR Act item:', error);
        res.status(500).json({ message: 'Error deleting PCSIR Act item' });
    }
};
