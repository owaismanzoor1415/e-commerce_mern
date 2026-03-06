const express = require("express");
const { placeOrder, placeOrderStripe, verifyOrder, allOrders, userOrders, updateStatus } = require("../controllers/orderController");
const auth = require("../middleware/auth"); // Middleware to check auth-token

const router = express.Router();

// Admin Features
router.post("/list", allOrders);
router.post("/status", updateStatus);

// Payment Features
router.post("/place", auth, placeOrder); // COD
router.post("/stripe", auth, placeOrderStripe); // Stripe
router.post("/verify", auth, verifyOrder); // Verify Payment

// User Features
router.get("/user", auth, userOrders);

module.exports = router;
