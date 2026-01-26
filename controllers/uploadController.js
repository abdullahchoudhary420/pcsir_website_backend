const upload = require('../middleware/upload');
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
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};
