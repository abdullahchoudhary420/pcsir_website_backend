const db = require('../config/db');
const logger = require('../config/logger');

// ============================================================================
// PUBLIC: GET FAQs
// ============================================================================

/**
 * Get all active FAQs grouped by category (Public)
 */
exports.getFAQs = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, question, answer, category, display_order
             FROM faqs
             WHERE is_active = true
             ORDER BY category, display_order, id`
        );
        res.json(result.rows || []);
    } catch (error) {
        logger.error('Error fetching FAQs:', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
};

// ============================================================================
// ADMIN: FAQ MANAGEMENT
// ============================================================================

/**
 * Get all FAQs (Admin)
 */
exports.getAllFAQs = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM faqs ORDER BY category, display_order, id`
        );
        res.json(result.rows || []);
    } catch (error) {
        logger.error('Error fetching all FAQs:', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
};

/**
 * Add a new FAQ (Admin)
 */
exports.addFAQ = async (req, res) => {
    try {
        const { question, answer, category = 'General', display_order = 0, is_active = true } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }

        const result = await db.query(
            `INSERT INTO faqs (question, answer, category, display_order, is_active)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [question, answer, category, display_order, is_active]
        );

        res.status(201).json({
            message: 'FAQ added successfully',
            id: result.rows[0].id
        });
    } catch (error) {
        logger.error('Error adding FAQ:', { error: error.message });
        res.status(500).json({ error: 'Failed to add FAQ' });
    }
};

/**
 * Update a FAQ (Admin)
 */
exports.updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, category, display_order, is_active } = req.body;

        const result = await db.query(
            `UPDATE faqs
             SET question = $1, answer = $2, category = $3, display_order = $4, is_active = $5
             WHERE id = $6`,
            [question, answer, category, display_order, is_active, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'FAQ not found' });
        }

        res.json({ message: 'FAQ updated successfully' });
    } catch (error) {
        logger.error('Error updating FAQ:', { error: error.message });
        res.status(500).json({ error: 'Failed to update FAQ' });
    }
};

/**
 * Delete a FAQ (Admin)
 */
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query('DELETE FROM faqs WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'FAQ not found' });
        }

        res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        logger.error('Error deleting FAQ:', { error: error.message });
        res.status(500).json({ error: 'Failed to delete FAQ' });
    }
};
