const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/auth");
const { addToCart, removeFromCart, getCart } = require("../controllers/cartController");

// All cart routes require authentication
router.post("/addtocart", authenticateUser, addToCart);
router.post("/removefromcart", authenticateUser, removeFromCart);
router.post("/getcart", authenticateUser, getCart);

module.exports = router;
