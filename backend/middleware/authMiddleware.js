const jwt = require("jsonwebtoken");

// Middleware to verify token


const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (error) {
        return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
};


// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ error: "Forbidden: Admins only" });
    }
};


module.exports = { verifyToken, verifyAdmin };
