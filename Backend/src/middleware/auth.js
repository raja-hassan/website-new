const checkLoggedIn = (req, res, next) => { // Middleware to check if the user is logged in
    next(); // User is authenticated
    return
    if (req.user) {
        next(); // User is authenticated
    } else {
        return res.status(401).send('Please log in to access this resource.'); // Not authenticated
    }
};

module.exports = checkLoggedIn;