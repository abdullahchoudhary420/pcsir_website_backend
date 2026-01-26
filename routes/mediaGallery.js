const express = require('express');
const router = express.Router();
const mediaGalleryController = require('../controllers/mediaGalleryController');
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// Helper wrapper for upload middleware to inject current date as module param if needed, 
// but existing upload middleware uses req.params.module which is not available in non-param routes easily 
// unless we define it in route path or handle it. Here we use 'gallery' as a fixed folder.
// The upload.js uses req.params.module OR 'general'. 
// We can wrap it to always set req.params.module = 'gallery' before calling upload.
const uploadGallery = (req, res, next) => {
    req.params.module = 'gallery';
    next();
};

// Public Routes
router.get('/', mediaGalleryController.getEvents);
router.get('/:id', mediaGalleryController.getEventDetails);

// Admin Routes (Protected)
router.post('/', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'gallery_events'), mediaGalleryController.createEvent);
router.put('/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'gallery_events'), mediaGalleryController.updateEvent);
router.delete('/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'gallery_events'), mediaGalleryController.deleteEvent);

// Route for uploading images to a specific event
// We use 'gallery' as the upload module
router.post('/:id/images', authenticateToken, uploadGallery, upload.array('images', 20), auditMiddleware(ACTIONS.UPDATE, 'gallery_events'), mediaGalleryController.addImages);
router.delete('/images/:imageId', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'gallery_images'), mediaGalleryController.removeImage);

module.exports = router;
