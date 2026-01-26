const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { authenticateToken } = require('../middleware/auth');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// =============================================================================
// HISTORY ROUTES
// =============================================================================
router.get('/history', aboutController.getHistory);
router.post('/history', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'history'), aboutController.addHistoryEntry);
router.put('/history/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'history'), aboutController.updateHistoryEntry);
router.delete('/history/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'history'), aboutController.deleteHistoryEntry);

// =============================================================================
// OBJECTIVES ROUTES
// =============================================================================
router.get('/objectives', aboutController.getObjectives);
router.post('/objectives', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'objectives'), aboutController.addObjective);
router.put('/objectives/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'objectives'), aboutController.updateObjective);
router.delete('/objectives/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'objectives'), aboutController.deleteObjective);

// =============================================================================
// ACHIEVEMENTS ROUTES
// =============================================================================
router.get('/achievements', aboutController.getAchievements);
router.post('/achievements', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'achievements'), aboutController.addAchievement);
router.put('/achievements/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'achievements'), aboutController.updateAchievement);
router.delete('/achievements/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'achievements'), aboutController.deleteAchievement);

module.exports = router;