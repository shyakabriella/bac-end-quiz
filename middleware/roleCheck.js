// middleware/roleCheck.js

const jwt = require('jsonwebtoken');

const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is missing." });
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token." });
            }

            const userRole = decodedToken.role;
            if (allowedRoles.includes(userRole)) {
                next();
            } else {
                return res.status(403).json({ message: "You don't have permission to access this resource." });
            }
        });
    };
};

module.exports = roleCheck;
