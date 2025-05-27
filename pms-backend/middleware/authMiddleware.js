const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    // If no token found, return error
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload to request object
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please login again' });
        }
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

module.exports = protect;