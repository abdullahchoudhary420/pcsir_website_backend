require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// Import routes
const apiRoutes = require('./routes/api');
const aboutRoutes = require('./routes/aboutRoutes');
const unitsRoutes = require('./routes/units');
const projectsRoute = require('./routes/projects');
const publicationsRoute = require('./routes/publications');
const advertisementsRoute = require('./routes/advertisements');
const contentPagesRoute = require('./routes/contentPages');
const contactRoute = require('./routes/contact');
const homeRoute = require('./routes/homeRoutes');
const mediaGalleryRoute = require('./routes/mediaGallery');

// Import middleware
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Helmet for security headers (disable contentSecurityPolicy for development)
// Helmet for security headers (disable contentSecurityPolicy for development)
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.CORS_ORIGINS || '').split(',').map(origin => origin.trim())
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting
app.use('/api', generalLimiter);

// Body parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from public directory (for uploaded images)
// Serve static files from public and uploads directory
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// =============================================================================
// API ROUTES
// =============================================================================

// Public routes (no auth required for GET)
app.use('/api/advertisements', advertisementsRoute);
app.use('/api/content', contentPagesRoute);
app.use('/api/contact', contactRoute);
app.use('/api/units', unitsRoutes);
app.use('/api/projects', projectsRoute);
app.use('/api/publications', publicationsRoute);
app.use('/api/home', homeRoute);
app.use('/api/about', aboutRoutes);
app.use('/api/gallery', mediaGalleryRoute);
app.use('/api/in-house-projects', require('./routes/inHouseProjects'));
app.use('/api/psdp-projects', require('./routes/psdpProjects'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Mixed routes (some public, some protected)
// Mixed routes (some public, some protected)
app.use('/api', apiRoutes);
app.use('/api/audit-logs', require('./routes/audit'));

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
