const jwt = require('jsonwebtoken');

/**
 * Role-based access control middleware
 * Use after authenticateToken middleware
 */

/**
 * Require specific role(s) for access
 * @param  {...string} allowedRoles - Roles that can access the route
 * @returns {Function} Express middleware
 * 
 * @example
 * // Single role
 * router.delete('/users/:id', authenticateToken, requireRole('superadmin'), deleteUser);
 * 
 * // Multiple roles
 * router.put('/settings', authenticateToken, requireRole('admin', 'superadmin'), updateSettings);
 */
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        // User should be attached by authenticateToken middleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userRole = req.user.role || 'admin';

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

/**
 * Check if user is superadmin
 */
const isSuperAdmin = requireRole('superadmin');

/**
 * Check if user is admin or higher
 */
const isAdmin = requireRole('admin', 'superadmin');

/**
 * Check if user is editor or higher
 */
const isEditor = requireRole('editor', 'admin', 'superadmin');

/**
 * Available roles (for reference):
 * - viewer: Can only view content
 * - editor: Can create and edit content
 * - admin: Full access to content management
 * - superadmin: Full system access including user management
 */

module.exports = {
    requireRole,
    isSuperAdmin,
    isAdmin,
    isEditor
};
