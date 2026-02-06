const upload = require('../middleware/upload');
const logger = require('../config/logger');
const path = require('path');

// Upload image endpoint
exports.uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const module = req.params.module || 'general';
        const imageUrl = `/uploads/${module}/${req.file.filename}`;

        res.json({
            success: true,
            url: imageUrl,
            filename: req.file.filename,
            size: req.file.size
        });
    } catch (error) {
        logger.error('Upload error:', { error: error.message });
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};
