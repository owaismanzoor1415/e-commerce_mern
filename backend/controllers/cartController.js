const User = require("../models/User");

/* ================= ADD TO CART ================= */

exports.addToCart = async (req, res) => {

  try {

    const userId = req.user.id;
    const { itemId } = req.body;

    if (!itemId && itemId !== 0) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let cartData = user.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Item added to cart",
      cartData
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }

};


/* ================= REMOVE FROM CART ================= */

exports.removeFromCart = async (req, res) => {

  try {

    const userId = req.user.id;
    const { itemId } = req.body;

    if (!itemId && itemId !== 0) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let cartData = user.cartData || {};

    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.json({
      success: true,
      message: "Item removed from cart",
      cartData
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


/* ================= GET CART ================= */

exports.getCart = async (req, res) => {

  try {

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      cartData: user.cartData || {}
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};