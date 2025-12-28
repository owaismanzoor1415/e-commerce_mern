const Product = require("../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get new collections (last 8 products)
// @route   GET /api/products/newcollections
// @access  Public
exports.getNewCollections = async (req, res, next) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
        res.json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get popular products in women category
// @route   GET /api/products/popularinwomen
// @access  Public
exports.getPopularInWomen = async (req, res, next) => {
    try {
        const products = await Product.find({ category: "women" }).limit(4);
        res.json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get related products by category
// @route   POST /api/products/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
    try {
        const { category } = req.body;

        if (!category) {
            return res.status(400).json({
                success: false,
                errors: "Category is required",
            });
        }

        const products = await Product.find({ category }).limit(4);
        res.json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add new product
// @route   POST /api/products
// @access  Admin (should add admin middleware later)
exports.addProduct = async (req, res, next) => {
    try {
        const { name, description, image, category, new_price, old_price } = req.body;

        // Get the last product to generate new ID
        const products = await Product.find({}).sort({ id: -1 }).limit(1);
        const id = products.length > 0 ? products[0].id + 1 : 1;

        const product = new Product({
            id,
            name,
            description,
            image,
            category,
            new_price,
            old_price,
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: `Product "${name}" added successfully`,
            product,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove product
// @route   DELETE /api/products/:id
// @access  Admin
exports.removeProduct = async (req, res, next) => {
    try {
        const { id } = req.body;

        const product = await Product.findOneAndDelete({ id });

        if (!product) {
            return res.status(404).json({
                success: false,
                errors: "Product not found",
            });
        }

        res.json({
            success: true,
            message: `Product "${product.name}" removed successfully`,
        });
    } catch (error) {
        next(error);
    }
};
