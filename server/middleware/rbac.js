const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'User role not found' });
        }
        
        // Check if the user's role is in the allowed roles array
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role (${req.user.role}) is not authorized to access this resource` 
            });
        }
        
        next();
    };
};

module.exports = { authorize };
