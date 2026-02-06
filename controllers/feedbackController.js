const db = require('../config/db');
const logger = require('../config/logger');
const { body, validationResult } = require('express-validator');

// ============================================================================
// VALIDATION RULES
// ============================================================================

exports.feedbackValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 255 }).withMessage('Name must be under 255 characters')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('feedback_type')
        .optional()
        .isIn(['suggestion', 'complaint', 'appreciation', 'general'])
        .withMessage('Invalid feedback type'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters')
];

// ============================================================================
// PUBLIC: SUBMIT FEEDBACK
// ============================================================================

/**
 * Submit feedback (Public)
 */
exports.submitFeedback = async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, feedback_type = 'general', message } = req.body;

        const result = await db.query(
            `INSERT INTO feedback_submissions (name, email, feedback_type, message)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [name, email, feedback_type, message]
        );

        res.status(201).json({
            message: 'Thank you for your feedback!',
            id: result.rows[0].id
        });
    } catch (error) {
        logger.error('Error submitting feedback:', { error: error.message });
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};

// ============================================================================
// ADMIN: FEEDBACK MANAGEMENT
// ============================================================================

/**
 * Get all feedback submissions (Admin)
 */
exports.getFeedbackSubmissions = async (req, res) => {
    try {
        const { status, type } = req.query;

        let query = 'SELECT * FROM feedback_submissions';
        const params = [];
        const conditions = [];
        let paramCount = 1;

        if (status) {
            conditions.push(`status = $${paramCount++}`);
            params.push(status);
        }
        if (type) {
            conditions.push(`feedback_type = $${paramCount++}`);
            params.push(type);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY submitted_at DESC';

        const result = await db.query(query, params);
        res.json(result.rows || []);
    } catch (error) {
        logger.error('Error fetching feedback:', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch feedback submissions' });
    }
};

/**
 * Update feedback status (Admin)
 */
exports.updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'reviewed', 'archived'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await db.query(
            'UPDATE feedback_submissions SET status = $1 WHERE id = $2',
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        logger.error('Error updating feedback status:', { error: error.message });
        res.status(500).json({ error: 'Failed to update status' });
    }
};

/**
 * Delete feedback (Admin)
 */
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query('DELETE FROM feedback_submissions WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        logger.error('Error deleting feedback:', { error: error.message });
        res.status(500).json({ error: 'Failed to delete feedback' });
    }
};
