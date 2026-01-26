const db = require('../config/db');

// ============================================================================
// SOCIAL LINKS CONTROLLERS - Full CRUD
// ============================================================================

exports.getSocialLinks = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM social_links';
        let countQuery = 'SELECT COUNT(*) FROM social_links';
        const params = [];
        const countParams = [];

        if (search) {
            const searchPattern = `%${search}%`;
            const searchClause = ' WHERE platform ILIKE $1 OR url ILIKE $1';
            query += searchClause;
            countQuery += searchClause;
            params.push(searchPattern);
            countParams.push(searchPattern);
        }

        query += ` ORDER BY id ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(parseInt(limit), parseInt(offset));

        const [dataResult, countResult] = await Promise.all([
            db.query(query, params),
            db.query(countQuery, countParams)
        ]);

        const total = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(total / limit);

        res.json({
            data: dataResult.rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages
            }
        });
    } catch (error) {
        console.error('getSocialLinks error:', error);
        res.status(500).json({ success: false, message: 'Error reading social links' });
    }
};

exports.addSocialLink = async (req, res) => {
    try {
        const { platform, url, icon } = req.body;
        const result = await db.query(
            'INSERT INTO social_links (platform, url, icon) VALUES ($1, $2, $3) RETURNING *',
            [platform, url, icon]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('addSocialLink error:', error);
        res.status(500).json({ success: false, message: 'Error saving social link' });
    }
};

exports.updateSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const { platform, url, icon } = req.body;
        const result = await db.query(
            'UPDATE social_links SET platform = $1, url = $2, icon = $3 WHERE id = $4 RETURNING *',
            [platform, url, icon, id]
        );

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Social link not found' });
        }
    } catch (error) {
        console.error('updateSocialLink error:', error);
        res.status(500).json({ success: false, message: 'Error updating social link' });
    }
};

exports.deleteSocialLink = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM social_links WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length > 0) {
            res.json({ success: true, message: 'Social link deleted' });
        } else {
            res.status(404).json({ success: false, message: 'Social link not found' });
        }
    } catch (error) {
        console.error('deleteSocialLink error:', error);
        res.status(500).json({ success: false, message: 'Error deleting social link' });
    }
};
