const db = require('../config/db');
const logger = require('../config/logger');

// ============================================================================
// BANNER CONFIG CONTROLLERS
// ============================================================================

exports.getBannerConfig = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM banner_config ORDER BY id LIMIT 1');
        res.json(result.rows[0] || {});
    } catch (error) {
        logger.error('getBannerConfig error', { error: error.message });
        res.status(500).json({ success: false, message: 'Error reading banner configuration' });
    }
};

exports.updateBannerConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled, title, subtitle, cta_text, cta_link } = req.body;
        const image = req.body.image || req.body.background_image;

        logger.debug('updateBannerConfig request', { id, body: req.body });

        const result = await db.query(
            'UPDATE banner_config SET enabled = $1, title = $2, subtitle = $3, cta_text = $4, cta_link = $5, background_image = $6 WHERE id = $7 RETURNING *',
            [enabled, title, subtitle, cta_text, cta_link, image, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            logger.warn('Banner config not found', { id });
            res.status(404).json({ success: false, message: 'Banner config not found' });
        }
    } catch (error) {
        logger.error('updateBannerConfig error', { error: error.message });
        res.status(500).json({ success: false, message: 'Error updating banner configuration' });
    }
};

exports.createBannerConfig = async (req, res) => {
    try {
        const { enabled, title, subtitle, cta_text, cta_link } = req.body;
        const image = req.body.image || req.body.background_image;

        const result = await db.query(
            'INSERT INTO banner_config (enabled, title, subtitle, cta_text, cta_link, background_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [enabled !== false, title, subtitle, cta_text, cta_link, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('createBannerConfig error', { error: error.message });
        res.status(500).json({ success: false, message: 'Error creating banner configuration' });
    }
};
