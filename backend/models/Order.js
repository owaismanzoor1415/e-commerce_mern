const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      name: String,
      image: String,
      price: Number,
      quantity: Number
    }
  ],

  amount: {
    type: Number,
    required: true
  },

  address: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    phone: String
  },

  paymentMethod: {
    type: String,
    default: "cod"
  },

  payment: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    default: "Processing"
  }

}, { timestamps: true });


module.exports = mongoose.model("Order", orderSchema);