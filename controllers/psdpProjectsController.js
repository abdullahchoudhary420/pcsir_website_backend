const pool = require('../config/db');

// Get all PSDP projects
const getProjects = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM psdp_projects ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching PSDP projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new PSDP project
const createProject = async (req, res) => {
    try {
        const { serial_no, psdp_no, name, approval_status, cost_total, cost_foreign_aid, psdp_foreign_aid, psdp_rupees, psdp_total, status } = req.body;

        const result = await pool.query(
            'INSERT INTO psdp_projects (serial_no, psdp_no, name, approval_status, cost_total, cost_foreign_aid, psdp_foreign_aid, psdp_rupees, psdp_total, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [serial_no, psdp_no, name, approval_status, cost_total, cost_foreign_aid, psdp_foreign_aid, psdp_rupees, psdp_total, status || 'Ongoing']
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating PSDP project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a PSDP project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { serial_no, psdp_no, name, approval_status, cost_total, cost_foreign_aid, psdp_foreign_aid, psdp_rupees, psdp_total, status } = req.body;

        const result = await pool.query(
            'UPDATE psdp_projects SET serial_no=$1, psdp_no=$2, name=$3, approval_status=$4, cost_total=$5, cost_foreign_aid=$6, psdp_foreign_aid=$7, psdp_rupees=$8, psdp_total=$9, status=$10 WHERE id=$11 RETURNING *',
            [serial_no, psdp_no, name, approval_status, cost_total, cost_foreign_aid, psdp_foreign_aid, psdp_rupees, psdp_total, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating PSDP project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a PSDP project
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM psdp_projects WHERE id = $1', [id]);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting PSDP project:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject
};
