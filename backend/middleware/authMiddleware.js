const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

const authenticate = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied. No token provided." });
      }
  
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET );
  
      // console.log("Decoded token in middleware:", decoded); // Debug log
  
      if (!decoded.id ) {
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
const authorize = (roles) => (req, res, next) => {
    try {
      // Ensure `req.user` exists from the `authenticate` middleware
      if (!req.user) {
        return res.status(403).json({ message: "Access denied. User not authenticated." });
      }
  
      // Check if the user's role is in the permitted roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
  
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(500).json({ message: "Internal server error during authorization." });
    }
  };


module.exports = { authenticate, authorize };
