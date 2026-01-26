const express = require('express');
const router = express.Router();
const contentPagesController = require('../controllers/contentPagesController');
const pcsirActController = require('../controllers/PcsirAct');
const pensionersCellController = require('../controllers/PensionersCell');
const seniorManagementController = require('../controllers/SeniorManagement');
const sifcController = require('../controllers/SIFC'); 1
const rtiController = require('../controllers/RightToInformation');
const { authenticateToken } = require('../middleware/auth');
const { auditMiddleware, ACTIONS } = require('../middleware/auditLogger');

// =============================================================================
// SCOPE AREAS
// =============================================================================
router.get('/scope', contentPagesController.getScopeAreas);
router.post('/scope', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'scope_areas'), contentPagesController.createScopeArea);
router.put('/scope/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'scope_areas'), contentPagesController.updateScopeArea);
router.delete('/scope/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'scope_areas'), contentPagesController.deleteScopeArea);

// =============================================================================
// TESTING SERVICES
// =============================================================================
router.get('/testing-services', contentPagesController.getTestingServices);
router.post('/testing-services', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'testing_services'), contentPagesController.createTestingService);
router.put('/testing-services/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'testing_services'), contentPagesController.updateTestingService);
router.delete('/testing-services/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'testing_services'), contentPagesController.deleteTestingService);

// =============================================================================
// TRAINING PROGRAMS
// =============================================================================
router.get('/training-programs', contentPagesController.getTrainingPrograms);
router.post('/training-programs', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'training_programs'), contentPagesController.createTrainingProgram);
router.put('/training-programs/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'training_programs'), contentPagesController.updateTrainingProgram);
router.delete('/training-programs/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'training_programs'), contentPagesController.deleteTrainingProgram);

// =============================================================================
// COURSES
// =============================================================================
router.get('/courses', contentPagesController.getCourses);
router.post('/courses', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'courses'), contentPagesController.createCourse);
router.put('/courses/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'courses'), contentPagesController.updateCourse);
router.delete('/courses/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'courses'), contentPagesController.deleteCourse);

// =============================================================================
// PCSIR ACT ITEMS
// =============================================================================
router.get('/pcsir-act', pcsirActController.getPCSIRActItems);
router.post('/pcsir-act', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'pcsir_act'), pcsirActController.createPCSIRActItem);
router.put('/pcsir-act/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'pcsir_act'), pcsirActController.updatePCSIRActItem);
router.delete('/pcsir-act/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'pcsir_act'), pcsirActController.deletePCSIRActItem);

// =============================================================================
// PENSIONERS CELL ITEMS
// =============================================================================
router.get('/pensioners-cell', pensionersCellController.getPensionersCellItems);
router.post('/pensioners-cell', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'pensioners_cell'), pensionersCellController.createPensionersCellItem);
router.put('/pensioners-cell/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'pensioners_cell'), pensionersCellController.updatePensionersCellItem);
router.delete('/pensioners-cell/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'pensioners_cell'), pensionersCellController.deletePensionersCellItem);

// =============================================================================
// SENIOR MANAGEMENT
// =============================================================================
router.get('/senior-management', seniorManagementController.getSeniorManagement);
router.post('/senior-management', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'senior_management'), seniorManagementController.createSeniorManagementMember);
router.put('/senior-management/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'senior_management'), seniorManagementController.updateSeniorManagementMember);
router.delete('/senior-management/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'senior_management'), seniorManagementController.deleteSeniorManagementMember);

// =============================================================================
// SIFC ITEMS
// =============================================================================
router.get('/sifc', sifcController.getSIFCItems);
router.post('/sifc', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'sifc'), sifcController.createSIFCItem);
router.put('/sifc/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'sifc'), sifcController.updateSIFCItem);
router.delete('/sifc/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'sifc'), sifcController.deleteSIFCItem);

// =============================================================================
// RIGHT TO INFORMATION ITEMS
// =============================================================================
router.get('/right-to-information', rtiController.getRTIItems);
router.post('/right-to-information', authenticateToken, auditMiddleware(ACTIONS.CREATE, 'right_to_information'), rtiController.createRTIItem);
router.put('/right-to-information/:id', authenticateToken, auditMiddleware(ACTIONS.UPDATE, 'right_to_information'), rtiController.updateRTIItem);
router.delete('/right-to-information/:id', authenticateToken, auditMiddleware(ACTIONS.DELETE, 'right_to_information'), rtiController.deleteRTIItem);

module.exports = router;
