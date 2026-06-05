const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const registerValidator = [
    body('username').trim().notEmpty().withMessage("Username is required").isLength({ min: 4, max: 20 }).withMessage("Username must be between 4 and 20 characters"),
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body('password').trim().notEmpty().withMessage("Password is required").isLength({ min: 6, max: 20 }).withMessage("Password must be between 6 and 20 characters"),
    validate,
];

const loginValidator = [
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body('password').trim().notEmpty().withMessage("Password is required"),
    validate,
];

const verifyEmailValidator = [
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    body('otp').trim().notEmpty().withMessage("Otp is required").isLength({ min: 6, max: 6 }).withMessage("Otp must be 6 digits"),
    validate,
];

const resendOtpValidator = [
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
    validate,
];

module.exports = { registerValidator, loginValidator, verifyEmailValidator, resendOtpValidator };