const userModel = require('../models/user.model');
const redis = require('../config/cache');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOtp, getOtpHtml } = require('../utils/otp.util')
const { sendEmail } = require('../services/email.service')
const otpModel = require('../models/otp.model')


const registerUserController = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });

    if (existingUser) {
        if (!existingUser.verified) {
            // Unverified user - update details and send new OTP
            const hash = await bcrypt.hash(password, 10);
            existingUser.username = username;
            existingUser.password = hash;
            existingUser.email = email;
            await existingUser.save();

            await otpModel.deleteMany({ email });
            const otp = generateOtp();
            const hashedOtp = await bcrypt.hash(otp, 10);
            await otpModel.create({
                email,
                otpHash: hashedOtp,
                user: existingUser._id,
            });

            const subject = "Verify your email";
            const html = getOtpHtml(otp);

            await sendEmail(email, subject, html);

            return res.status(200).json({
                message: "Unverified account found. A new verification code has been sent to your email.",
                user: existingUser
            });
        } else {
            return res.status(400).json({ message: "Username or email already exists" });
        }
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
    });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await otpModel.create({
        email,
        otpHash: hashedOtp,
        user: user._id,
    });

    const subject = "Verify your email";
    const html = getOtpHtml(otp);

    await sendEmail(email, subject, html);

    res.status(201).json({
        message: "User registered successfully",
        user
    });
}

const verifyUserEmailController = async (req, res) => {
    const {otp, email} = req.body;

    const otpData = await otpModel.findOne({
        email: email,
    });

    if(!otpData) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const isMatched = await bcrypt.compare(otp, otpData.otpHash);

    if(!isMatched) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await userModel.findById(otpData.user);
    if(!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.verified = true;
    await user.save();

    await otpModel.deleteMany({
        email: email,
    });

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET,
        { expiresIn: '2d'}
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.status(200).json({
        message: "User verified successfully",
        user
    });
}

const loginUserController = async (req, res) => {
    const {username, email, password } = req.body;

    const user = await userModel.findOne({
        $or:[
            {email: email},
            {username: username}
        ]
    }).select("+password");
    if(!user) {
        return res.status(400).json({ message: "account does not exist" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(400).json({ message: "password invalid" });

    if(!user.verified) {
        return res.status(401).json({ message: "Please verify your email" });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET,
        { expiresIn: '2d'}
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.status(200).json({
        message: "User logged in successfully",
        user
    });
}

const getMeController = async (req, res) => {
    const user = await userModel.findById(req.user.id);
    if(!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User fetched successfully",
        user
    });
}

const logoutUserController = async (req, res) => {
    const token = req.cookies.token;

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    await redis.set(token, Date.now().toString(), 'EX', 2 * 24 * 60 * 60);

    res.status(200).json({
        message: "User logged out successfully",
    });
}

const resendOtpController = async (req, res) => {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "Account does not exist" });
    }

    if (user.verified) {
        return res.status(400).json({ message: "Account is already verified" });
    }

    // Delete old OTP entries
    await otpModel.deleteMany({ email });

    // Generate new OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await otpModel.create({
        email,
        otpHash: hashedOtp,
        user: user._id
    });

    const subject = "Verify your email";
    const html = getOtpHtml(otp);
    await sendEmail(email, subject, html);

    res.status(200).json({
        message: "New verification code sent to your email"
    });
}

module.exports = {
    registerUserController,
    verifyUserEmailController,
    loginUserController,
    logoutUserController,
    getMeController,
    resendOtpController,
}