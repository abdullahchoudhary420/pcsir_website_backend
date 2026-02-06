const pool = require('../config/db');
const logger = require('../config/logger');
const fs = require('fs');
const path = require('path');

// Get all projects
const getProjects = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM in_house_projects ORDER BY created_at ASC');
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching in-house projects:', { error: error.message });
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new project
const createProject = async (req, res) => {
    try {
        const { title, description } = req.body;
        const file = req.file;

        if (!title || !file) {
            return res.status(400).json({ message: 'Title and file are required' });
        }

        const filePath = `/uploads/gallery/${file.filename}`; // Reusing existing upload path structure or new one? Upload middleware usually sets destination.

        // Note: The upload middleware determines where the file goes. 
        // If we use module='in-house', it goes to public/uploads/in-house. 
        // We need to adjust the stored path accordingly.
        // Assuming we pass 'in-house' as module param in route.
        const storedPath = `/uploads/in-house/${file.filename}`;

        const result = await pool.query(
            'INSERT INTO in_house_projects (title, description, file_path) VALUES ($1, $2, $3) RETURNING *',
            [title, description, storedPath]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error creating in-house project:', { error: error.message });
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a project
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Get file path to delete file
        const projectResult = await pool.query('SELECT * FROM in_house_projects WHERE id = $1', [id]);

        if (projectResult.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const project = projectResult.rows[0];

        // Delete from DB
        await pool.query('DELETE FROM in_house_projects WHERE id = $1', [id]);

        // Delete file
        const fullPath = path.join(__dirname, '../public', project.file_path);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        logger.error('Error deleting in-house project:', { error: error.message });
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProjects,
    createProject,
    deleteProject
};
