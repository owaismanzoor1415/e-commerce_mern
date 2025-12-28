const Order = require("../models/Order");
const User = require("../models/User");
const Stripe = require("stripe");

// Initialize Stripe (User needs to provide Secret Key in .env)
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

// Placing logic for COD
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
            payment: false
        })

        await newOrder.save();

        // Clear user cart
        await User.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Placing logic for Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, amount, address } = req.body;
        const { origin } = req.headers;

        const newOrder = new Order({
            userId,
            products: items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false
        })
        await newOrder.save();

        if (!stripe) {
            return res.json({ success: false, message: "Stripe is not configured in backend" });
        }

        // Perform Stripe Line items creation
        // This assumes 'items' contains price info needed or we fetch from DB
        // For simplicity, we are passing amount directly as a single item for now or logic needs to map products

        const line_items = items.map((item) => ({
            price_data: {
                currency: 'inr', // currency
                product_data: {
                    name: "Product-ID: " + item.productId
                },
                unit_amount: item.price * 100 // assuming item comes with price from frontend or fetched from DB
            },
            quantity: item.quantity
        }))

        // Create Checkout Session
        /* 
           NOTE: In a real Scenario, we should fetch product details from DB using IDs 
           to ensure price integrity. For this demo, we assume frontend passes valid data 
           or we create a session based on total amount.
        */

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Verify Stripe Payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await Order.findByIdAndUpdate(orderId, { payment: true });
            await User.findByIdAndUpdate(req.user.id, { cartData: {} }); // Clear cart on success
            res.json({ success: true, message: "Paid" });
        } else {
            await Order.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// All Orders for Admin Panel
const allOrders = async (req, res) => {
    try {
        // Fetch all orders
        const orders = await Order.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders Data (Frontend "My Orders")
const userOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Update Order Status (Admin Panel)
const updateStatus = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

module.exports = { placeOrder, placeOrderStripe, verifyOrder, allOrders, userOrders, updateStatus }
