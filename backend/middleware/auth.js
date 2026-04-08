const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authenticateUser = (req, res, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.user?.id || decoded.id
    };

    if (req.user.id) {
      req.user.id = new mongoose.Types.ObjectId(req.user.id);
    }

    next();

  } catch (error) {

    console.log("Auth Error:", error.message);

    // ✅ Handle expired token separately
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

module.exports = authenticateUser;