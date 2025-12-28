const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({
            success: false,
            errors: "Please authenticate using a valid token",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            errors: "Invalid or expired token",
        });
    }
};

module.exports = authenticateUser;
