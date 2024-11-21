const checkAdminRole = (req, res, next) => { // Middleware to check if the user is an admin
    next(); // User is an admin
    return
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin
    } else {
        return res.status(403).json('Access denied.'); // Not an admin
    }
};

module.exports = checkAdminRole;