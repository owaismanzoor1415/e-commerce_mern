const User = require("../models/User");

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res, next) => {
    try {
        const { itemId } = req.body;

        if (!itemId && itemId !== 0) {
            return res.status(400).json({
                success: false,
                errors: "Item ID is required",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                errors: "User not found",
            });
        }

        // Initialize if doesn't exist
        if (!user.cartData[itemId]) {
            user.cartData[itemId] = 0;
        }

        user.cartData[itemId] += 1;
        await user.save();

        res.json({
            success: true,
            message: "Item added to cart",
            cartData: user.cartData,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   POST /api/cart/remove
// @access  Private
exports.removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.body;

        if (!itemId && itemId !== 0) {
            return res.status(400).json({
                success: false,
                errors: "Item ID is required",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                errors: "User not found",
            });
        }

        if (user.cartData[itemId] && user.cartData[itemId] > 0) {
            user.cartData[itemId] -= 1;
        }

        await user.save();

        res.json({
            success: true,
            message: "Item removed from cart",
            cartData: user.cartData,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                errors: "User not found",
            });
        }

        res.json({
            success: true,
            cartData: user.cartData,
        });
    } catch (error) {
        next(error);
    }
};
