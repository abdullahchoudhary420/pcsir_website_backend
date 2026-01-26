const db = require('../config/db');

/**
 * CRUD Factory
 * Generates standard CRUD controller functions for database tables
 * Reduces boilerplate in individual controller files
 * 
 * @param {string} tableName - Database table name
 * @param {object} options - Configuration options
 * @param {string[]} options.searchFields - Fields to search on (default: ['title', 'description'])
 * @param {string} options.orderBy - Default ORDER BY clause (default: 'id ASC')
 * @param {string[]} options.selectFields - Fields to select (default: '*')
 */
const createCRUDController = (tableName, options = {}) => {
    const {
        searchFields = ['title', 'description'],
        orderBy = 'id ASC',
        selectFields = '*'
    } = options;

    /**
     * Get all items with pagination and search
     */
    const getAll = async (req, res) => {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const offset = (page - 1) * limit;

            let query = `SELECT ${selectFields} FROM ${tableName}`;
            let countQuery = `SELECT COUNT(*) FROM ${tableName}`;
            const params = [];
            const countParams = [];

            if (search && searchFields.length > 0) {
                const searchPattern = `%${search}%`;
                const searchClauses = searchFields.map((_, idx) =>
                    `${searchFields[idx]} ILIKE $${idx + 1}`
                ).join(' OR ');
                const searchClause = ` WHERE ${searchClauses}`;

                query += searchClause;
                countQuery += searchClause;

                searchFields.forEach(() => {
                    params.push(searchPattern);
                    countParams.push(searchPattern);
                });
            }

            query += ` ORDER BY ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(parseInt(limit), parseInt(offset));

            const [dataResult, countResult] = await Promise.all([
                db.query(query, params),
                db.query(countQuery, countParams)
            ]);

            const total = parseInt(countResult.rows[0].count);
            const totalPages = Math.ceil(total / limit);

            res.json({
                data: dataResult.rows,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages
                }
            });
        } catch (error) {
            console.error(`getAll ${tableName} error:`, error);
            res.status(500).json({ success: false, message: `Error reading ${tableName}` });
        }
    };

    /**
     * Get a single item by ID
     */
    const getById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await db.query(`SELECT ${selectFields} FROM ${tableName} WHERE id = $1`, [id]);

            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ success: false, message: `${tableName} item not found` });
            }
        } catch (error) {
            console.error(`getById ${tableName} error:`, error);
            res.status(500).json({ success: false, message: `Error reading ${tableName}` });
        }
    };

    /**
     * Create a new item
     * Note: This generates INSERT based on request body keys
     */
    const create = async (req, res) => {
        try {
            const data = req.body;
            const keys = Object.keys(data);
            const values = Object.values(data);
            const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');

            const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
            const result = await db.query(query, values);

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error(`create ${tableName} error:`, error);
            res.status(500).json({ success: false, message: `Error creating ${tableName} item` });
        }
    };

    /**
     * Update an existing item
     */
    const update = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const keys = Object.keys(data).filter(k => k !== 'id');
            const values = keys.map(k => data[k]);

            const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
            const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

            const result = await db.query(query, [...values, id]);

            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ success: false, message: `${tableName} item not found` });
            }
        } catch (error) {
            console.error(`update ${tableName} error:`, error);
            res.status(500).json({ success: false, message: `Error updating ${tableName} item` });
        }
    };

    /**
     * Delete an item by ID
     */
    const remove = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await db.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);

            if (result.rows.length > 0) {
                res.json({ success: true, message: `${tableName} item deleted` });
            } else {
                res.status(404).json({ success: false, message: `${tableName} item not found` });
            }
        } catch (error) {
            console.error(`delete ${tableName} error:`, error);
            res.status(500).json({ success: false, message: `Error deleting ${tableName} item` });
        }
    };

    return {
        getAll,
        getById,
        create,
        update,
        remove
    };
};

module.exports = { createCRUDController };
