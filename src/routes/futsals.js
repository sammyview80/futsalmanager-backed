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
const Futsal = require('../models/Futsal');

router
    .route('/')
    .get(advanceResults(Futsal, ''), getFutsals)
    .post(createFutsal)

router
    .route('/:id')
    .get(getFutsal)
    .delete(deleteFutsal)
    .put(updateFutsal)


module.exports = router;