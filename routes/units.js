const express = require('express');
const router = express.Router();
const unitsController = require('../controllers/unitsController');
const { authenticateToken } = require('../middleware/auth');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// =============================================================================
// UNITS ROUTES - Full CRUD
// =============================================================================

// GET all units with pagination and search (Public)
router.get('/', unitsController.getUnits);

// GET single unit by ID (Public)
router.get('/:id', unitsController.getUnitById);

// POST create new unit (Protected)
router.post('/', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'units'), unitsController.addUnit);

// PUT update existing unit (Protected)
router.put('/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'units'), unitsController.updateUnit);

// DELETE remove unit (Protected)
router.delete('/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'units'), unitsController.deleteUnit);

module.exports = router;