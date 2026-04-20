const db = require('../config/db');
const logger = require('../config/logger');
const { body, validationResult } = require('express-validator');

// ============================================================================
// VALIDATION RULES
// ============================================================================

exports.pollValidation = [
    body('question')
        .trim()
        .notEmpty().withMessage('Question is required')
        .isLength({ max: 500 }).withMessage('Question must be under 500 characters'),
    body('options')
        .isArray({ min: 2 }).withMessage('At least 2 options are required')
        .custom((options) => {
            if (options.some(opt => !opt.trim())) {
                throw new Error('All options must have text');
            }
            return true;
        })
];

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

/**
 * Get the currently active poll for the homepage (Public)
 */
exports.getActivePoll = async (req, res) => {
    try {
        const pollResult = await db.query(
            'SELECT id, question, description, expires_at FROM polls WHERE is_active = true AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP) ORDER BY created_at DESC LIMIT 1'
        );

        if (pollResult.rows.length === 0) {
            // Lazy deactivation for active polls that have expired
            await db.query('UPDATE polls SET is_active = false WHERE is_active = true AND expires_at <= CURRENT_TIMESTAMP');
            return res.json(null);
        }

        const poll = pollResult.rows[0];
        const optionsResult = await db.query(
            'SELECT id, option_text FROM poll_options WHERE poll_id = $1 ORDER BY display_order ASC',
            [poll.id]
        );

        poll.options = optionsResult.rows;
        res.json(poll);
    } catch (error) {
        logger.error('Error fetching active poll:', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch active poll' });
    }
};

/**
 * Submit a vote (Public)
 */
exports.vote = async (req, res) => {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const { pollId, optionId } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
        // Check if poll exists and is active
        const pollCheck = await db.query('SELECT is_active FROM polls WHERE id = $1', [pollId]);
        if (pollCheck.rows.length === 0 || !pollCheck.rows[0].is_active) {
            return res.status(400).json({ error: 'Poll is not active or does not exist' });
        }

        // Insert vote
        await db.query(
            'INSERT INTO poll_votes (poll_id, option_id, ip_address, user_id) VALUES ($1, $2, $3, $4)',
            [pollId, optionId, clientIp, userId]
        );

        res.status(201).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ error: 'You have already voted in this poll' });
        }
        logger.error('Error recording vote:', { error: error.message, pollId, optionId, ip: clientIp });
        res.status(500).json({ error: 'Failed to record vote' });
    }
};

/**
 * Get results for a specific poll (Public)
 */
exports.getResults = async (req, res) => {
    const { id } = req.params;
    try {
        const pollResult = await db.query('SELECT question FROM polls WHERE id = $1', [id]);
        if (pollResult.rows.length === 0) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        const statsResult = await db.query(
            `SELECT po.id, po.option_text, COUNT(pv.id)::int as votes
             FROM poll_options po
             LEFT JOIN poll_votes pv ON po.id = pv.option_id
             WHERE po.poll_id = $1
             GROUP BY po.id, po.option_text
             ORDER BY po.display_order ASC`,
            [id]
        );

        const totalVotesResult = await db.query(
            'SELECT COUNT(*)::int as total FROM poll_votes WHERE poll_id = $1',
            [id]
        );

        res.json({
            question: pollResult.rows[0].question,
            results: statsResult.rows,
            totalVotes: totalVotesResult.rows[0].total
        });
    } catch (error) {
        logger.error('Error fetching poll results:', { error: error.message, pollId: id });
        res.status(500).json({ error: 'Failed to fetch results' });
    }
};

// ============================================================================
// ADMIN ROUTES
// ============================================================================

/**
 * Get all polls (Admin)
 */
exports.getAllPolls = async (req, res) => {
    try {
        // Lazy deactivation check before returning all polls
        await db.query('UPDATE polls SET is_active = false WHERE is_active = true AND expires_at <= CURRENT_TIMESTAMP');

        const result = await db.query(
            `SELECT p.*, 
             (SELECT COUNT(*) FROM poll_votes WHERE poll_id = p.id) as total_votes
             FROM polls p 
             ORDER BY p.created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching all polls:', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch polls' });
    }
};

/**
 * Create a new poll (Admin)
 */
exports.createPoll = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { question, description, options, is_active, expires_at } = req.body;
    const createdBy = req.user.id;

    logger.info('Creating poll:', { question, is_active, expires_at });

    let client;
    try {
        client = await db.getClient();
        await client.query('BEGIN');

        // If this poll is set to active, deactivate all other polls first
        if (is_active) {
            await client.query('UPDATE polls SET is_active = false WHERE is_active = true');
        }

        // Create poll
        const pollResult = await client.query(
            'INSERT INTO polls (question, description, is_active, created_by, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [question, description, is_active || false, createdBy, expires_at || null]
        );
        const pollId = pollResult.rows[0].id;

        // Create options
        for (let i = 0; i < options.length; i++) {
            await client.query(
                'INSERT INTO poll_options (poll_id, option_text, display_order) VALUES ($1, $2, $3)',
                [pollId, options[i], i]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ id: pollId, message: 'Poll created successfully' });
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        logger.error('Error creating poll:', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Failed to create poll', details: error.message });
    } finally {
        if (client) client.release();
    }
};

/**
 * Update a poll (Admin)
 */
exports.updatePoll = async (req, res) => {
    const { id } = req.params;
    const { question, description, is_active, expires_at, options } = req.body;

    logger.info('Updating poll request:', { id, is_active, expires_at, hasOptions: !!options });

    let client;
    try {
        client = await db.getClient();
        await client.query('BEGIN');

        if (is_active === true) {
            await client.query('UPDATE polls SET is_active = false WHERE id != $1 AND is_active = true', [id]);
        }

        // Get current values to support partial updates
        const currentResult = await client.query('SELECT question, description, is_active, expires_at FROM polls WHERE id = $1', [id]);
        if (currentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Poll not found' });
        }
        const currentPoll = currentResult.rows[0];

        const finalQuestion = question !== undefined ? question : currentPoll.question;
        const finalDescription = description !== undefined ? description : currentPoll.description;
        const finalIsActive = is_active !== undefined ? is_active : currentPoll.is_active;
        const finalExpiresAt = (expires_at !== undefined && expires_at !== '') ? expires_at : currentPoll.expires_at;

        logger.info('Final update values:', { finalQuestion, finalIsActive, finalExpiresAt });

        const result = await client.query(
            'UPDATE polls SET question = $1, description = $2, is_active = $3, expires_at = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
            [finalQuestion, finalDescription, finalIsActive, finalExpiresAt, id]
        );

        // Update options if provided
        if (options && Array.isArray(options)) {
            // Delete existing options
            await client.query('DELETE FROM poll_options WHERE poll_id = $1', [id]);

            // Insert new options
            for (let i = 0; i < options.length; i++) {
                await client.query(
                    'INSERT INTO poll_options (poll_id, option_text, display_order) VALUES ($1, $2, $3)',
                    [id, options[i], i]
                );
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Poll updated successfully' });
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        logger.error('Error updating poll:', { error: error.message, pollId: id, stack: error.stack });
        res.status(500).json({ error: 'Failed to update poll', details: error.message });
    } finally {
        if (client) client.release();
    }
};

/**
 * Delete a poll (Admin)
 */
exports.deletePoll = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM polls WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        res.json({ message: 'Poll deleted successfully' });
    } catch (error) {
        logger.error('Error deleting poll:', { error: error.message, pollId: id });
        res.status(500).json({ error: 'Failed to delete poll' });
    }
};

/**
 * Get a single poll by ID (Admin)
 */
exports.getPollById = async (req, res) => {
    const { id } = req.params;
    try {
        const pollResult = await db.query('SELECT * FROM polls WHERE id = ', [id]);
        if (pollResult.rows.length === 0) {
            return res.status(404).json({ error: 'Poll not found' });
        }
        
        const poll = pollResult.rows[0];
        const optionsResult = await db.query('SELECT * FROM poll_options WHERE poll_id =  ORDER BY display_order', [id]);
        poll.options = optionsResult.rows;
        
        res.json(poll);
    } catch (error) {
        logger.error('Error fetching poll by ID:', { id, error: error.message });
        res.status(500).json({ error: 'Failed to fetch poll details' });
    }
};
