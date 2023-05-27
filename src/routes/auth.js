const express = require('express');

// Controllers
const {
    register,
    login,
    logout,
    getMe,
    forgetPassword
} = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

// Express router
const router = express.Router();

router
    .route('/register')
    .post(register)

router
    .route('/login')
    .post(login)

router
    .route('/logout')
    .get(logout)

router
    .route('/me')
    .get(protect, getMe)

router
    .route('/logout')
    .get()

router
    .route('/forgetpassword')
    .post(forgetPassword)
module.exports = router;
