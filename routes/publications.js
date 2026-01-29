const express = require('express');
const router = express.Router();
const publicationsController = require('../controllers/publicationsController');
const { authenticateToken } = require('../middleware/auth');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// =============================================================================
// PUBLICATIONS ROUTES - Full CRUD
// =============================================================================

// GET all publications with pagination and search (Public)
router.get('/', publicationsController.getPublications);

// POST create new publication (Protected)
router.post('/', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'publications'), publicationsController.addPublication);

// PUT update existing publication (Protected)
router.put('/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'publications'), publicationsController.updatePublication);

// DELETE remove publication (Protected)
router.delete('/:id', authenticateToken, publicationsController.deletePublication);

module.exports = router;