const express = require('express');

// Controllers
const {
    getReservations,
    getReservation,
    createReservation,
    updateReservation,
    deleteReservation
} = require('../controllers/reservations');
const { deleteUser } = require('../controllers/users');

// Express router
const router = express.Router({mergeParams: true});

// Advance results
const advanceResults = require('../middlewares/advanceResults');
const { protect, authorization } = require('../middlewares/auth');

// Model Reservation
const Reservation = require('../models/Reservation');

router.use(protect)

router
    .route('/')
    .get(advanceResults(Reservation, {
        path: 'futsal',
        select: 'name status'
    }), getReservations)
    .post(createReservation)

router
    .route('/:id')
    .get(getReservation)
    .put(updateReservation)
    .delete(deleteReservation)
module.exports = router;