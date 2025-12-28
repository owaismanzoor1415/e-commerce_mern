const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Initialize empty cart
const initializeCart = () => {
    const cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    return cart;
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                errors: "Please provide all required fields",
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                errors: "User already exists with this email",
            });
        }

        // Create user
        const user = new User({
            name: username,
            email,
            password, // Note: In production, use bcrypt to hash password
            cartData: initializeCart(),
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                errors: "Please provide email and password",
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                errors: "Invalid email or password",
            });
        }

        // Check password (In production, use bcrypt.compare)
        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                errors: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};
