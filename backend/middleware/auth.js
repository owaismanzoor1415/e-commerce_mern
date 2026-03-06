const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authenticateUser = (req, res, next) => {

  try {

    // Get token from header
    const token = req.header("auth-token");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request
    req.user = {
      id: decoded.user?.id || decoded.id
    };

    // Convert id to ObjectId (prevents MongoDB mismatch)
    if (req.user.id) {
      req.user.id = new mongoose.Types.ObjectId(req.user.id);
    }

    next();

  } catch (error) {

    console.log("Auth Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};

module.exports = authenticateUser;