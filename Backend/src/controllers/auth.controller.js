const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUserController = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
        $or: [
            { username: username },
            { email: email }
        ]
    });
    if(existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
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

    res.status(201).json({
        message: "User registered successfully",
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
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatched = bcrypt.compare(password,user.password);
    if(!isMatched) return res.status(400).json({message: "password invalid"});

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

module.exports = {
    registerUserController,
    loginUserController,
}