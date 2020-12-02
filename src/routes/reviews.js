const express = require('express');

// Controllers
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews');
const ApiError = require('../errors/ApiError');

// Express router
const router = express.Router({mergeParams: true});

// Advance results
const advanceResults = require('../middlewares/advanceResults');
const { protect, authorization } = require('../middlewares/auth');

// Model
const Review = require('../models/Review');


router
    .route('/')
    .get(advanceResults(Review, {
        path: 'futsal',
        select: 'name status'
    }), getReviews)
    .post(protect, authorization('user', 'admin'), addReview)

router
    .route('/:id')
    .get(getReview)
    .put(protect, updateReview)
    .delete(protect, deleteReview)

    

module.exports = router;