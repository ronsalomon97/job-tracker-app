import jwt from 'jsonwebtoken';
const cors = require('cors');

// Define allowed origins for CORS
const allowedOrigins = [
    "http://localhost:5173",  // Local frontend
    "https://job-tracker-nni0jerup-ron-salomons-projects.vercel.app",  // Vercel frontend
];

// CORS configuration middleware
const corsOptions = {
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allows cookies, auth headers
};

// Middleware to handle CORS
const corsMiddleware = cors(corsOptions);

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided." });
      }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

export { corsMiddleware, authMiddleware };