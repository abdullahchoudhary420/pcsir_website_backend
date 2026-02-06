const db = require('../config/db');
const logger = require('../config/logger');

// ============================================================================
// SITE SETTINGS CONTROLLERS
// ============================================================================

exports.getSettings = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM site_settings');
        const settings = result.rows.reduce((acc, row) => {
            acc[row.key] = row.value;
            return acc;
        }, {});
        res.json(settings);
    } catch (error) {
        logger.error('getSettings error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error reading settings' });
    }
};

exports.updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const result = await db.query(
            'UPDATE site_settings SET value = $1 WHERE key = $2 RETURNING *',
            [value, key]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Setting not found' });
        }
    } catch (error) {
        logger.error('updateSetting error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error updating setting' });
    }
};

exports.createOrUpdateSetting = async (req, res) => {
    try {
        const { key, value } = req.body;
        const result = await db.query(
            `INSERT INTO site_settings (key, value) 
             VALUES ($1, $2) 
             ON CONFLICT (key) DO UPDATE SET value = $2 
             RETURNING *`,
            [key, value]
        );
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('createOrUpdateSetting error:', { error: error.message });
        res.status(500).json({ success: false, message: 'Error saving setting' });
    }
};
