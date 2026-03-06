const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const contentController = require('../controllers/contentController');
const newsController = require('../controllers/newsController');
const infoCardsController = require('../controllers/infoCardsController');
const statisticsController = require('../controllers/statisticsController');
const servicesController = require('../controllers/servicesController');
const settingsController = require('../controllers/settingsController');
const navbarController = require('../controllers/navbarController');
const bannerController = require('../controllers/bannerController');
const socialLinksController = require('../controllers/socialLinksController');
const labsController = require('../controllers/labsController');
const uploadController = require('../controllers/uploadController');
const faqController = require('../controllers/faqController');
const feedbackController = require('../controllers/feedbackController');
const pollController = require('../controllers/pollController');

// Middleware
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// =============================================================================
// AUTH ROUTES (Public)
// =============================================================================
router.post('/login', authLimiter, authController.loginValidation, authController.login);

// =============================================================================
// FAQ ROUTES
// =============================================================================
router.get('/faqs', faqController.getFAQs);
router.get('/faqs/all', faqController.getAllFAQs);
router.post('/faqs', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'faqs'), faqController.addFAQ);
router.put('/faqs/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'faqs'), faqController.updateFAQ);
router.delete('/faqs/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'faqs'), faqController.deleteFAQ);

// =============================================================================
// FEEDBACK ROUTES
// =============================================================================
router.post('/feedback', feedbackController.feedbackValidation, feedbackController.submitFeedback);
router.get('/feedback', feedbackController.getFeedbackSubmissions);
router.put('/feedback/:id/status', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'feedback'), feedbackController.updateFeedbackStatus);
router.delete('/feedback/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'feedback'), feedbackController.deleteFeedback);

// =============================================================================
// POLL ROUTES
// =============================================================================
router.get('/polls/active', pollController.getActivePoll);
router.post('/polls/:id/vote', pollController.vote);
router.get('/polls/:id/results', pollController.getResults);
router.get('/polls', authenticateToken, pollController.getAllPolls);
router.post('/polls', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'polls'), pollController.pollValidation, pollController.createPoll);
router.put('/polls/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'polls'), pollController.updatePoll);
router.delete('/polls/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'polls'), pollController.deletePoll);

// =============================================================================
// PROJECT ROUTES (using legacy contentController until fully migrated)
// =============================================================================
// Note: Main project routes are in projects.js
router.get('/projects', contentController.getProjects);
router.post('/projects', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'projects'), contentController.addProject);
router.put('/projects/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'projects'), contentController.updateProject);
router.delete('/projects/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'projects'), contentController.deleteProject);

// =============================================================================
// NEWS ROUTES (using new modular controller)
// =============================================================================
router.get('/news', newsController.getNews);
router.post('/news', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'news'), newsController.addNews);
router.put('/news/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'news'), newsController.updateNews);
router.delete('/news/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'news'), newsController.deleteNews);

// =============================================================================
// INFO CARDS ROUTES (using new modular controller)
// =============================================================================
router.get('/info-cards', infoCardsController.getInfoCards);
router.post('/info-cards', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'info_cards'), infoCardsController.addInfoCard);
router.put('/info-cards/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'info_cards'), infoCardsController.updateInfoCard);
router.delete('/info-cards/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'info_cards'), infoCardsController.deleteInfoCard);

// =============================================================================
// ABOUT ENTRIES ROUTES (using legacy contentController)
// =============================================================================
// Note: Main about routes are in aboutRoutes.js
router.get('/about', contentController.getAboutEntries);
router.post('/about', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'about_entries'), contentController.addAboutEntry);
router.put('/about/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'about_entries'), contentController.updateAboutEntry);
router.delete('/about/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'about_entries'), contentController.deleteAboutEntry);

// =============================================================================
// SITE SETTINGS ROUTES (using new modular controller)
// =============================================================================
router.get('/settings', settingsController.getSettings);
router.put('/settings/:key', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'settings'), settingsController.updateSetting);

// =============================================================================
// SERVICES ROUTES (using new modular controller)
// =============================================================================
router.get('/services', servicesController.getServices);
router.post('/services', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'services'), servicesController.addService);
router.put('/services/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'services'), servicesController.updateService);
router.delete('/services/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'services'), servicesController.deleteService);

// =============================================================================
// STATISTICS ROUTES (using new modular controller)
// =============================================================================
router.get('/statistics', statisticsController.getStatistics);
router.post('/statistics', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'statistics'), statisticsController.addStatistic);
router.put('/statistics/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'statistics'), statisticsController.updateStatistic);
router.delete('/statistics/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'statistics'), statisticsController.deleteStatistic);

// =============================================================================
// SOCIAL LINKS ROUTES (using new modular controller)
// =============================================================================
router.get('/social-links', socialLinksController.getSocialLinks);
router.post('/social-links', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'social_links'), socialLinksController.addSocialLink);
router.put('/social-links/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'social_links'), socialLinksController.updateSocialLink);
router.delete('/social-links/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'social_links'), socialLinksController.deleteSocialLink);

// =============================================================================
// PUBLICATIONS ROUTES (using legacy contentController)
// =============================================================================
// Note: Main publication routes are in publications.js
router.get('/publications', contentController.getPublications);
router.post('/publications', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'publications'), contentController.addPublication);
router.delete('/publications/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'publications'), contentController.deletePublication);

// =============================================================================
// LABS ROUTES (using new modular controller)
// =============================================================================
router.get('/labs', labsController.getLabs);
router.post('/labs', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'labs'), labsController.addLab);
router.put('/labs/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'labs'), labsController.updateLab);
router.delete('/labs/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'labs'), labsController.deleteLab);

// =============================================================================
// NAVBAR ROUTES (using new modular controller)
// =============================================================================
router.get('/navbar', navbarController.getNavbarItems);
router.post('/navbar', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'navbar'), navbarController.addNavbarItem);
router.put('/navbar/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'navbar'), navbarController.updateNavbarItem);
router.delete('/navbar/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'navbar'), navbarController.deleteNavbarItem);

// =============================================================================
// BANNER CONFIG ROUTES (using new modular controller)
// =============================================================================
router.get('/banner-config', bannerController.getBannerConfig);
router.put('/banner-config/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'banner_config'), bannerController.updateBannerConfig);

// =============================================================================
// IMAGE UPLOAD ROUTE (Protected)
// =============================================================================
router.post('/upload/:module', authenticateToken, upload.single('image'), uploadController.uploadImage);

module.exports = router;
