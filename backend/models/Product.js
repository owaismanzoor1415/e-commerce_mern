const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide product name"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please provide product description"],
        },
        image: {
            type: String,
            required: [true, "Please provide product image"],
        },
        category: {
            type: String,
            required: [true, "Please provide product category"],
            enum: ["men", "women", "kids"],
        },
        new_price: {
            type: Number,
            required: [true, "Please provide new price"],
        },
        old_price: {
            type: Number,
            required: [true, "Please provide old price"],
        },
        available: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);