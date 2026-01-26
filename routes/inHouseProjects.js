const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { getProjects, createProject, deleteProject } = require('../controllers/inHouseProjectsController');

router.get('/', getProjects);
router.post('/', (req, res, next) => {
    req.params.module = 'in-house';
    next();
}, upload.single('file'), createProject);
router.delete('/:id', deleteProject);

module.exports = router;
