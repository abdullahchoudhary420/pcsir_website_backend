const db = require('../config/db');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

/**
 * Validation rules for contact form submission
 */
exports.contactFormValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
        .escape(),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('phone')
        .optional()
        .trim()
        .escape(),
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 2, max: 200 }).withMessage('Subject must be 2-200 characters')
        .escape(),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters')
];

// Email transporter configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// ============================================================================
// CONTACT INFO MANAGEMENT
// ============================================================================

// Get all contact locations
exports.getContactInfo = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM contact_info 
            ORDER BY display_order ASC, id ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching contact info:', error);
        res.status(500).json({ message: 'Error fetching contact info' });
    }
};

// Get primary contact location
exports.getPrimaryContact = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM contact_info 
            WHERE is_primary = true 
            LIMIT 1
        `);
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error fetching primary contact:', error);
        res.status(500).json({ message: 'Error fetching primary contact' });
    }
};

// Add new contact location
exports.addContactInfo = async (req, res) => {
    try {
        const { location_name, address, phone, email, fax, office_hours, map_embed_url, is_primary, display_order } = req.body;

        // If setting as primary, unset other primary locations
        if (is_primary) {
            await db.query('UPDATE contact_info SET is_primary = false');
        }

        const result = await db.query(`
            INSERT INTO contact_info 
            (location_name, address, phone, email, fax, office_hours, map_embed_url, is_primary, display_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [location_name, address, phone, email, fax, office_hours, map_embed_url, is_primary || false, display_order || 0]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding contact info:', error);
        res.status(500).json({ message: 'Error adding contact info' });
    }
};

// Update contact location
exports.updateContactInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { location_name, address, phone, email, fax, office_hours, map_embed_url, is_primary, display_order } = req.body;

        // If setting as primary, unset other primary locations
        if (is_primary) {
            await db.query('UPDATE contact_info SET is_primary = false WHERE id != $1', [id]);
        }

        const result = await db.query(`
            UPDATE contact_info SET
                location_name = $1,
                address = $2,
                phone = $3,
                email = $4,
                fax = $5,
                office_hours = $6,
                map_embed_url = $7,
                is_primary = $8,
                display_order = $9
            WHERE id = $10
            RETURNING *
        `, [location_name, address, phone, email, fax, office_hours, map_embed_url, is_primary, display_order, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Contact location not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating contact info:', error);
        res.status(500).json({ message: 'Error updating contact info' });
    }
};

// Delete contact location
exports.deleteContactInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM contact_info WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Contact location not found' });
        }

        res.json({ message: 'Contact location deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact info:', error);
        res.status(500).json({ message: 'Error deleting contact info' });
    }
};

// ============================================================================
// CONTACT FORM SUBMISSION
// ============================================================================

// Submit contact form
exports.submitContactForm = async (req, res) => {
    try {
        // Check validation errors from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, phone, subject, message } = req.body;

        // Save to database
        const result = await db.query(`
            INSERT INTO contact_submissions (name, email, phone, subject, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [name, email, phone || null, subject, message]);

        const submission = result.rows[0];

        // Send email notification (if configured)
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = createTransporter();
                const recipientEmail = process.env.CONTACT_FORM_TO || 'info@pcsir.gov.pk';

                await transporter.sendMail({
                    from: `"PCSIR Website" <${process.env.SMTP_USER}>`,
                    to: recipientEmail,
                    replyTo: email,
                    subject: `Contact Form: ${subject}`,
                    html: `
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                        <hr>
                        <p><small>Submitted at: ${new Date(submission.submitted_at).toLocaleString()}</small></p>
                    `,
                });

                console.log('Contact form email sent successfully');
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                // Don't fail the request if email fails
            }
        }

        res.status(201).json({
            message: 'Thank you for contacting us! We will get back to you soon.',
            submission: submission
        });

    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ message: 'Error submitting contact form. Please try again.' });
    }
};

// ============================================================================
// ADMIN: CONTACT SUBMISSIONS MANAGEMENT
// ============================================================================

// Get all contact submissions (admin)
exports.getContactSubmissions = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM contact_submissions WHERE 1=1';
        const params = [];
        let paramCount = 0;

        if (status) {
            paramCount++;
            query += ` AND status = $${paramCount}`;
            params.push(status);
        }

        if (search) {
            paramCount++;
            query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR message ILIKE $${paramCount})`;
            params.push(`%${search}%`);
        }

        // Get total count
        const countResult = await db.query(query.replace('SELECT *', 'SELECT COUNT(*)'), params);
        const total = parseInt(countResult.rows[0].count);

        // Get paginated results
        query += ` ORDER BY submitted_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        res.json({
            data: result.rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        res.status(500).json({ message: 'Error fetching contact submissions' });
    }
};

// Update submission status
exports.updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be: new, read, or replied' });
        }

        const result = await db.query(`
            UPDATE contact_submissions 
            SET status = $1 
            WHERE id = $2 
            RETURNING *
        `, [status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating submission status:', error);
        res.status(500).json({ message: 'Error updating submission status' });
    }
};

// Delete submission
exports.deleteSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM contact_submissions WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ message: 'Error deleting submission' });
    }
};
