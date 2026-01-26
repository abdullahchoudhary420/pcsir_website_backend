const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const auditLogger = require('../utils/auditLogger');

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.*, 
                COALESCE(
                    (
                        SELECT json_agg(json_build_object('id', mi.id, 'image_url', mi.image_url, 'caption', mi.caption))
                        FROM (SELECT * FROM media_images WHERE event_id = e.id ORDER BY display_order ASC) mi
                    ),
                    '[]'
                ) as images
            FROM media_events e
            ORDER BY e.event_date DESC
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get single event details with all images
exports.getEventDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const eventQuery = 'SELECT * FROM media_events WHERE id = $1';
        const eventResult = await db.query(eventQuery, [id]);

        if (eventResult.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const imagesQuery = 'SELECT * FROM media_images WHERE event_id = $1 ORDER BY display_order ASC';
        const imagesResult = await db.query(imagesQuery, [id]);

        const event = eventResult.rows[0];
        event.images = imagesResult.rows;

        res.json(event);
    } catch (err) {
        console.error('Error fetching event details:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create new event
exports.createEvent = async (req, res) => {
    const { title, description, event_date } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO media_events (title, description, event_date) VALUES ($1, $2, $3) RETURNING *',
            [title, description, event_date]
        );
        const newRecord = result.rows[0];

        if (req.user) {
            await auditLogger.log(req, 'CREATE', 'media_events', newRecord.id, null, newRecord);
        }

        res.status(201).json(newRecord);
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, event_date } = req.body;
    try {
        // Get old record
        const oldResult = await db.query('SELECT * FROM media_events WHERE id = $1', [id]);
        if (oldResult.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const oldRecord = oldResult.rows[0];

        const result = await db.query(
            'UPDATE media_events SET title = $1, description = $2, event_date = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
            [title, description, event_date, id]
        );

        const updatedRecord = result.rows[0];

        if (req.user) {
            await auditLogger.log(req, 'UPDATE', 'media_events', id, oldRecord, updatedRecord);
        }

        res.json(updatedRecord);
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete event and its images
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        // Get old record
        const oldResult = await db.query('SELECT * FROM media_events WHERE id = $1', [id]);
        if (oldResult.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const oldRecord = oldResult.rows[0];

        // First delete images from filesystem (optional, but good practice)
        // ... (skipped filesystem logic for brevity as per original)

        const result = await db.query('DELETE FROM media_events WHERE id = $1 RETURNING *', [id]);

        if (req.user) {
            await auditLogger.log(req, 'DELETE', 'media_events', id, oldRecord, null);
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add images to event
exports.addImages = async (req, res) => {
    const { id } = req.params;
    const files = req.files; // Array of files

    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded' });
    }

    try {
        const imagePromises = files.map(file => {
            const imageUrl = `/uploads/gallery/${file.filename}`;
            return db.query(
                'INSERT INTO media_images (event_id, image_url) VALUES ($1, $2) RETURNING *',
                [id, imageUrl]
            );
        });

        const results = await Promise.all(imagePromises);
        const images = results.map(r => r.rows[0]);

        if (req.user) {
            // Log batch or single? Single log for batch add might be cleaner, but logging individual images is fine too.
            // For simplicity, we'll log the first one or a summary.
            await auditLogger.log(req, 'CREATE', 'media_images', id, null, { count: images.length, event_id: id });
        }

        res.status(201).json(images);
    } catch (err) {
        console.error('Error adding images:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove single image
exports.removeImage = async (req, res) => {
    const { imageId } = req.params;
    try {
        // Get old record
        const oldResult = await db.query('SELECT * FROM media_images WHERE id = $1', [imageId]);
        if (oldResult.rows.length === 0) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const oldRecord = oldResult.rows[0];

        const result = await db.query('DELETE FROM media_images WHERE id = $1 RETURNING *', [imageId]);

        if (req.user) {
            await auditLogger.log(req, 'DELETE', 'media_images', imageId, oldRecord, null);
        }

        res.json({ message: 'Image removed successfully' });
    } catch (err) {
        console.error('Error removing image:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
