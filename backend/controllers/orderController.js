const Order = require("../models/Order");
const User = require("../models/User");
const Stripe = require("stripe");

/* ================= STRIPE INITIALIZATION ================= */

let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  } else {
    console.warn("⚠️ STRIPE_SECRET_KEY is missing. Stripe payments will fail.");
  }
} catch (err) {
  console.warn("Failed to initialize Stripe:", err.message);
}


/* ================= PLACE ORDER (COD) ================= */

const placeOrder = async (req, res) => {
  try {

    const userId = req.user.id;
    const { items, amount, address, paymentMethod } = req.body;

    const newOrder = new Order({
      userId,
      products: items,
      amount,
      address,
      paymentMethod,
      payment: false,
      status: "Order Placed"  
    });

    await newOrder.save();

    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.json({
      success: true,
      message: "Order Placed Successfully"
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error placing order"
    });
  }
};


/* ================= PLACE ORDER STRIPE ================= */

const placeOrderStripe = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.json({
        success: false,
        message: "User not authenticated"
      });
    }

    const userId = req.user.id;

    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    const newOrder = new Order({
      userId,
      products: items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order Placed"
    });

    await newOrder.save();

    if (!stripe) {
      return res.json({
        success: false,
        message: "Stripe not configured"
      });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Product-ID: " + item.productId
        },
        unit_amount: item.price * 100
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({
      success: true,
      session_url: session.url
    });

  } catch (error) {
    console.log("STRIPE ORDER ERROR:", error);

    res.json({
      success: false,
      message: "Stripe order failed"
    });
  }
};


/* ================= VERIFY PAYMENT ================= */

const verifyOrder = async (req, res) => {

  const { orderId, success } = req.body;

  try {

    if (success === "true") {

      await Order.findByIdAndUpdate(orderId, { payment: true });

      await User.findByIdAndUpdate(req.user.id, { cartData: {} });

      res.json({
        success: true,
        message: "Payment Verified"
      });

    } else {

      await Order.findByIdAndDelete(orderId);

      res.json({
        success: false,
        message: "Payment Failed"
      });

    }

  } catch (error) {

    console.log("VERIFY ERROR:", error);

    res.json({
      success: false,
      message: "Verification Error"
    });

  }

};


/* ================= ADMIN: ALL ORDERS ================= */

const allOrders = async (req, res) => {

  try {

    const orders = await Order.find({});

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Error fetching orders"
    });

  }

};


/* ================= USER ORDERS ================= */

const userOrders = async (req, res) => {

  try {

    if (!req.user) {
      return res.json({
        success: false,
        message: "User not authenticated"
      });
    }

    const orders = await Order.find({ userId: req.user.id || req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orders
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Error fetching user orders"
    });

  }

};


/* ================= UPDATE STATUS (ADMIN) ================= */

const updateStatus = async (req, res) => {

  try {

    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });

    res.json({
      success: true,
      message: "Order status updated"
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Status update failed"
    });

  }

};


module.exports = {
  placeOrder,
  placeOrderStripe,
  verifyOrder,
  allOrders,
  userOrders,
  updateStatus
};
