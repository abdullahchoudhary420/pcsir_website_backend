const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

/**
 * Validation rules for login
 */
exports.loginValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
        .escape(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * Handle login request
 */
exports.login = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Verify hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                // Update last login time
                await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username,
                        role: user.role || 'admin'
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '8h' }
                );
                return res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role || 'admin'
                    }
                });
            }
        }

        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
