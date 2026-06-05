const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    otpHash: {
        type: String,
        required: [true, "Otp is required"],
    },
}, {
    timestamps: true,
    expireAfterSeconds: 60 * 5
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;