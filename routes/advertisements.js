const express = require('express');
const router = express.Router();
const advertisementsController = require('../controllers/advertisementsController');
const { authenticateToken } = require('../middleware/auth');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// =============================================================================
// ADVERTISEMENTS ROUTES
// =============================================================================

// Public routes
router.get('/', advertisementsController.getAdvertisements);
router.get('/:id', advertisementsController.getAdvertisementById);

// Protected routes (require authentication)
router.post('/', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'advertisements'), advertisementsController.createAdvertisement);
router.put('/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'advertisements'), advertisementsController.updateAdvertisement);
router.delete('/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'advertisements'), advertisementsController.deleteAdvertisement);

module.exports = router;
