import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

// Middleware: Authenticate User
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET );

    if (!decoded.id) {
      return res.status(400).json({ message: "User ID is missing in the token payload." });
    }

    req.user = decoded; // Attach the decoded payload to req.user
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Middleware: Authorize User by Role
export const authorize = (roles) => (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({ message: "Access denied. User not authenticated." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error during authorization." });
  }
};
