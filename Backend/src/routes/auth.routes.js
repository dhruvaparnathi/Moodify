const express = require('express');
const authController = require('../controllers/auth.controller');
const authUser = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator, verifyEmailValidator, resendOtpValidator } = require('../validations/auth.validator');

const authRouter = express.Router();

authRouter.post('/register', registerValidator, authController.registerUserController);
authRouter.post('/login', loginValidator, authController.loginUserController);
authRouter.get('/logout', authController.logoutUserController);
authRouter.get('/get-me', authUser, authController.getMeController);
authRouter.post('/verify-email', verifyEmailValidator, authController.verifyUserEmailController);
authRouter.post('/resend-otp', resendOtpValidator, authController.resendOtpController);

module.exports = authRouter;