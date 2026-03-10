const express = require("express");
const router = express.Router();

const {
  placeOrder,
  placeOrderStripe,
  verifyOrder,
  allOrders,
  userOrders,
  updateStatus
} = require("../controllers/orderController");

const authenticateUser = require("../middleware/auth");

/* USER ROUTES */
router.post("/place", authenticateUser, placeOrder);
router.post("/stripe", authenticateUser, placeOrderStripe);
router.post("/verify", authenticateUser, verifyOrder);
router.get("/userorders", authenticateUser, userOrders);

/* ADMIN ROUTES */
router.post("/list", allOrders);
router.post("/status", updateStatus);

module.exports = router;