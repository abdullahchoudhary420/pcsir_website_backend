const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticateToken } = require('../middleware/auth');

// GET all logs (Protected - Admin only)
router.get('/', authenticateToken, auditController.getLogs);

module.exports = router;
