const express = require('express');

// Controllers
const {
    getFutsals,
    getFutsal,
    createFutsal,
    deleteFutsal,
    updateFutsal
} = require('../controllers/futsals');

// Express router
const router = express.Router();

// Advance results
const advanceResults = require('../middlewares/advanceResults');
const { protect } = require('../middlewares/auth');
const Futsal = require('../models/Futsal');

router
    .route('/')
    .get(advanceResults(Futsal, ''), getFutsals)
    .post(protect, createFutsal)

router
    .route('/:id')
    .get(getFutsal)
    .delete(protect, deleteFutsal)
    .put(protect, updateFutsal)


module.exports = router;