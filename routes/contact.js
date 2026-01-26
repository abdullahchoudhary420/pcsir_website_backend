const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');
const { contactFormLimiter } = require('../middleware/rateLimiter');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// =============================================================================
// PUBLIC ROUTES
// =============================================================================

// Get all contact locations
router.get('/info', contactController.getContactInfo);

// Get primary contact location
router.get('/info/primary', contactController.getPrimaryContact);

// Submit contact form (public, rate limited, with validation)
router.post('/submit', contactFormLimiter, contactController.contactFormValidation, contactController.submitContactForm);

// =============================================================================
// ADMIN ROUTES - Contact Info Management (Protected)
// =============================================================================

// Add new contact location
router.post('/info', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'contact_info'), contactController.addContactInfo);

// Update contact location
router.put('/info/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'contact_info'), contactController.updateContactInfo);

// Delete contact location
router.delete('/info/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'contact_info'), contactController.deleteContactInfo);

// =============================================================================
// ADMIN ROUTES - Submissions Management (Protected)
// =============================================================================

// Get all contact submissions (with pagination)
router.get('/submissions', authenticateToken, contactController.getContactSubmissions);

// Update submission status
router.put('/submissions/:id/status', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'contact_submissions'), contactController.updateSubmissionStatus);

// Delete submission
router.delete('/submissions/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'contact_submissions'), contactController.deleteSubmission);

module.exports = router;
