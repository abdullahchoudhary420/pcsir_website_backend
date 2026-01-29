const db = require('../config/db');

// ============================================================================
// NAVBAR CONTROLLERS - Full CRUD
// ============================================================================

exports.getNavbarItems = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM navbar ORDER BY order_index ASC');
        res.json({ data: result.rows });
    } catch (error) {
        console.error('getNavbarItems error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack,
            code: error.code
        });
    }
};

exports.addNavbarItem = async (req, res) => {
    try {
        const { label, path, order_index, is_visible, parent_id } = req.body;
        const result = await db.query(
            'INSERT INTO navbar (label, path, order_index, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [label, path, order_index || 0, parent_id || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('addNavbarItem error:', error);
        res.status(500).json({ success: false, message: 'Error saving navbar item' });
    }
};

exports.updateNavbarItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, path, order_index, parent_id } = req.body;
        const result = await db.query(
            'UPDATE navbar SET label = $1, path = $2, order_index = $3, parent_id = $4 WHERE id = $5 RETURNING *',
            [label, path, order_index, parent_id || null, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Navbar item not found' });
        }
    } catch (error) {
        console.error('updateNavbarItem error:', error);
        res.status(500).json({ success: false, message: 'Error updating navbar item' });
    }
};

exports.deleteNavbarItem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM navbar WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Navbar item deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Navbar item not found' });
        }
    } catch (error) {
        console.error('deleteNavbarItem error:', error);
        res.status(500).json({ success: false, message: 'Error deleting navbar item' });
    }
};
