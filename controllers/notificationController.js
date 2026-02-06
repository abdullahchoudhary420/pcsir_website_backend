const db = require('../config/db');
const logger = require('../config/logger');

// Get all notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM notifications WHERE is_active = true ORDER BY date DESC');
        res.json(result.rows);
    } catch (error) {
        logger.error('getAllNotifications error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
};
// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const { title, date } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
        }

        const filePath = `/uploads/notifications/${req.file.filename}`;

        const result = await db.query(
            'INSERT INTO notifications (title, file_path, date) VALUES ($1, $2, $3) RETURNING *',
            [title, filePath, date]
        );

        res.status(201).json({ success: true, notification: result.rows[0] });
    } catch (error) {
        logger.error('createNotification error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error creating notification' });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM notifications WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        logger.error('deleteNotification error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error deleting notification' });
    }
};
