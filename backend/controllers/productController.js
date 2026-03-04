const Product = require("../models/Product");

exports.getAllProducts = async (req, res, next) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.page) || 1;

    const count = await Product.countDocuments();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    res.json({
      success: true,
      count,
      page,
      pages: Math.ceil(count / pageSize),
      products,
    });
  } catch (error) {
    next(error);
  }
};


exports.getNewCollections = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};


exports.getPopularInWomen = async (req, res, next) => {
  try {
    const products = await Product.find({ category: "women" })
      .limit(10)
      .lean();

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};


exports.getRelatedProducts = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    const products = await Product.find({ category })
      .limit(10)
      .lean();

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};


exports.addProduct = async (req, res, next) => {
  try {
    const { name, description, image, category, new_price, old_price } =
      req.body;

    const product = new Product({
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


exports.removeProduct = async (req, res, next) => {
  try {
    const { id } = req.body;   

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
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
