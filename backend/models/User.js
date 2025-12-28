const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 6,
        },
        cartData: {
            type: Object,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
