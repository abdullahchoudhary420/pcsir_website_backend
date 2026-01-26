const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const { authenticateToken } = require('../middleware/auth');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// =============================================================================
// PROJECTS ROUTES - Full CRUD
// =============================================================================

// GET all projects with pagination and search (Public)
router.get('/', projectsController.getProjects);

// POST create new project (Protected)
router.post('/', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'projects'), projectsController.addProject);

// PUT update existing project (Protected)
router.put('/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'projects'), projectsController.updateProject);

// DELETE remove project (Protected)
router.delete('/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'projects'), projectsController.deleteProject);

module.exports = router;