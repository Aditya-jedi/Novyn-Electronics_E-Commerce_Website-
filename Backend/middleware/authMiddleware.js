// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// Protect routes (check if user is logged in)
const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔍 Decoded token:", decoded); // For debugging
      // ✅ FIXED LINE — use decoded.id
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};
// Check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied, Admins only" });
  }
};
module.exports = { protect, admin };