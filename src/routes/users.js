const express = require('express');

// Controllers
const {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/users');

// Express router
const router = express.Router();

// Advance results
const advanceResults = require('../middlewares/advanceResults');
const User = require('../models/User');
const { route } = require('./futsals');

router
    .route('/')
    .get(advanceResults(User, ''), getUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router;