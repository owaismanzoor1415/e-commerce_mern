const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: { type: Number, required: true },
            quantity: { type: Number, required: true },
            name: { type: String },
            image: { type: String },
            price: { type: Number },
            _id: false
        },
    ],
    amount: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        default: "Order Placed",
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    payment: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
