const express = require('express');

const router = express.Router();

const authControllers = require('../controllers/auth');

const { body } = require('express-validator');

const validateUser = [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .isStrongPassword().withMessage('Password must contain at least one uppercase, one lowecase and one symbol'),
    body('phone').isMobilePhone().withMessage('Please enter a valid phone number')
];

const validatePassword = [
    body('newPassword')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .isStrongPassword().withMessage('Password must contain at least one uppercase, one lowecase and one symbol'),
]


router.post('/login', authControllers.login);
router.post('/register', validateUser, authControllers.register);
router.get('/verify-otp', authControllers.verifyPasswordResetOTP);
router.post('/forgot-password', authControllers.forgotPassword);
router.post('verify-access-token', authControllers.verifyToken);
router.post('/reset-password',validatePassword, authControllers.resetPassword);


module.exports = router;
