const db = require('../config/db');
const logger = require('../config/logger');

// ============================================================================
// SCOPE AREAS - FULL CRUD
// ============================================================================

exports.getScopeAreas = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM scope_areas ORDER BY display_order ASC, id ASC');
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching scope areas:', { error: error.message });
        res.status(500).json({ message: 'Error fetching scope areas' });
    }
};

exports.createScopeArea = async (req, res) => {
    try {
        const { icon, title, description, display_order } = req.body;
        const result = await db.query(`
            INSERT INTO scope_areas (icon, title, description, display_order)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [icon, title, description, display_order || 0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error creating scope area:', { error: error.message });
        res.status(500).json({ message: 'Error creating scope area' });
    }
};

exports.updateScopeArea = async (req, res) => {
    try {
        const { id } = req.params;
        const { icon, title, description, display_order } = req.body;
        const result = await db.query(`
            UPDATE scope_areas SET 
                icon = $1, 
                title = $2, 
                description = $3, 
                display_order = $4
            WHERE id = $5
            RETURNING *
        `, [icon, title, description, display_order, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Scope area not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error updating scope area:', { error: error.message });
        res.status(500).json({ message: 'Error updating scope area' });
    }
};

exports.deleteScopeArea = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM scope_areas WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Scope area not found' });
        }
        res.json({ message: 'Scope area deleted successfully' });
    } catch (error) {
        logger.error('Error deleting scope area:', { error: error.message });
        res.status(500).json({ message: 'Error deleting scope area' });
    }
};

// ============================================================================
// TESTING SERVICES - FULL CRUD
// ============================================================================

exports.getTestingServices = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM testing_services ORDER BY display_order ASC, id ASC');
        const services = result.rows.map(service => ({
            ...service,
            services_list: service.services_list ? service.services_list.split(',') : [],
            services_available: service.services_available ? service.services_available.split(',').map(s => s.trim()) : []
        }));
        res.json(services);
    } catch (error) {
        logger.error('Error fetching testing services:', { error: error.message });
        res.status(500).json({ message: 'Error fetching testing services' });
    }
};

exports.createTestingService = async (req, res) => {
    try {
        const { icon, title, description, services_list, approximate_time, testing_method, services_available, display_order } = req.body;
        const servicesString = Array.isArray(services_list) ? services_list.join(',') : services_list;
        const servicesAvailableString = Array.isArray(services_available) ? services_available.join(',') : services_available;

        const result = await db.query(`
            INSERT INTO testing_services (icon, title, description, services_list, approximate_time, testing_method, services_available, display_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [icon, title, description || '', servicesString, approximate_time || '', testing_method || '', servicesAvailableString || '', display_order || 0]);

        const service = {
            ...result.rows[0],
            services_list: result.rows[0].services_list ? result.rows[0].services_list.split(',') : [],
            services_available: result.rows[0].services_available ? result.rows[0].services_available.split(',').map(s => s.trim()) : []
        };
        res.status(201).json(service);
    } catch (error) {
        logger.error('Error creating testing service:', { error: error.message });
        res.status(500).json({ message: 'Error creating testing service' });
    }
};

exports.updateTestingService = async (req, res) => {
    try {
        const { id } = req.params;
        const { icon, title, description, services_list, approximate_time, testing_method, services_available, display_order } = req.body;
        const servicesString = Array.isArray(services_list) ? services_list.join(',') : services_list;
        const servicesAvailableString = Array.isArray(services_available) ? services_available.join(',') : services_available;

        const result = await db.query(`
            UPDATE testing_services SET 
                icon = $1, 
                title = $2, 
                description = $3, 
                services_list = $4, 
                approximate_time = $5,
                testing_method = $6,
                services_available = $7,
                display_order = $8
            WHERE id = $9
            RETURNING *
        `, [icon, title, description, servicesString, approximate_time || '', testing_method || '', servicesAvailableString || '', display_order, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Testing service not found' });
        }

        const service = {
            ...result.rows[0],
            services_list: result.rows[0].services_list ? result.rows[0].services_list.split(',') : [],
            services_available: result.rows[0].services_available ? result.rows[0].services_available.split(',').map(s => s.trim()) : []
        };
        res.json(service);
    } catch (error) {
        logger.error('Error updating testing service:', { error: error.message });
        res.status(500).json({ message: 'Error updating testing service' });
    }
};

exports.deleteTestingService = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM testing_services WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Testing service not found' });
        }
        res.json({ message: 'Testing service deleted successfully' });
    } catch (error) {
        logger.error('Error deleting testing service:', { error: error.message });
        res.status(500).json({ message: 'Error deleting testing service' });
    }
};

// ============================================================================
// TRAINING PROGRAMS - FULL CRUD
// ============================================================================

exports.getTrainingPrograms = async (req, res) => {
    try {
        const programsResult = await db.query('SELECT * FROM training_programs ORDER BY display_order ASC, id ASC');

        const programs = await Promise.all(programsResult.rows.map(async (program) => {
            const coursesResult = await db.query('SELECT * FROM courses WHERE program_id = $1 ORDER BY id ASC', [program.id]);
            return {
                ...program,
                courses: coursesResult.rows
            };
        }));

        res.json(programs);
    } catch (error) {
        logger.error('Error fetching training programs:', { error: error.message });
        res.status(500).json({ message: 'Error fetching training programs' });
    }
};

exports.createTrainingProgram = async (req, res) => {
    try {
        const { icon, program_name, institution, description, display_order } = req.body;

        const result = await db.query(`
            INSERT INTO training_programs (icon, program_name, institution, description, display_order)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [icon, program_name, institution || '', description || '', display_order || 0]);

        res.status(201).json({ ...result.rows[0], courses: [] });
    } catch (error) {
        logger.error('Error creating training program:', { error: error.message });
        res.status(500).json({ message: 'Error creating training program' });
    }
};

exports.updateTrainingProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const { icon, program_name, institution, description, display_order } = req.body;

        const result = await db.query(`
            UPDATE training_programs SET 
                icon = $1, 
                program_name = $2, 
                institution = $3, 
                description = $4, 
                display_order = $5
            WHERE id = $6
            RETURNING *
        `, [icon, program_name, institution, description, display_order, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Training program not found' });
        }

        const coursesResult = await db.query('SELECT * FROM courses WHERE program_id = $1', [id]);
        res.json({ ...result.rows[0], courses: coursesResult.rows });
    } catch (error) {
        logger.error('Error updating training program:', { error: error.message });
        res.status(500).json({ message: 'Error updating training program' });
    }
};

exports.deleteTrainingProgram = async (req, res) => {
    try {
        const { id } = req.params;
        // Courses will be deleted automatically due to ON DELETE CASCADE
        const result = await db.query('DELETE FROM training_programs WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Training program not found' });
        }
        res.json({ message: 'Training program deleted successfully' });
    } catch (error) {
        logger.error('Error deleting training program:', { error: error.message });
        res.status(500).json({ message: 'Error deleting training program' });
    }
};

// ============================================================================
// COURSES
// ============================================================================

exports.getCourses = async (req, res) => {
    try {
        const { program_id } = req.query;
        let query = 'SELECT * FROM courses';
        const params = [];

        if (program_id) {
            query += ' WHERE program_id = $1';
            params.push(program_id);
        }

        query += ' ORDER BY id ASC';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching courses:', { error: error.message });
        res.status(500).json({ message: 'Error fetching courses' });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { program_id, course_name, duration } = req.body;

        const result = await db.query(`
            INSERT INTO courses (program_id, course_name, duration)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [program_id, course_name, duration || '']);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error creating course:', { error: error.message });
        res.status(500).json({ message: 'Error creating course' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { program_id, course_name, duration } = req.body;

        const result = await db.query(`
            UPDATE courses SET 
                program_id = $1, 
                course_name = $2, 
                duration = $3
            WHERE id = $4
            RETURNING *
        `, [program_id, course_name, duration, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error updating course:', { error: error.message });
        res.status(500).json({ message: 'Error updating course' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        logger.error('Error deleting course:', { error: error.message });
        res.status(500).json({ message: 'Error deleting course' });
    }
};
