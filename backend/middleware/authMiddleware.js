const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "Access Denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user data to request object
    next();  // Proceed to next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
