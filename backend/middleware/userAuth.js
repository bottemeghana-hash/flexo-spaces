
const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view your bookings.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.sub || !["User", "Owner"].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: "User or space owner access required.",
      });
    }

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired login. Please log in again.",
    });
  }
};

module.exports = userAuth;
