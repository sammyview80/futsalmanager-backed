const express = require('express');

// Controllers
const {
    getFutsals,
    getFutsal,
    createFutsal,
    deleteFutsal,
    updateFutsal,
    getMyFutsals
} = require('../controllers/futsals');

// Express router
const router = express.Router();

// Include other resource routers
const reservationRoutes = require('./reservations');

// Advance results
const advanceResults = require('../middlewares/advanceResults');
const { protect, authorization } = require('../middlewares/auth');
const Futsal = require('../models/Futsal');

// Re-route into other resource routers
router.use('/:futsalId/reservations', reservationRoutes)


router
    .route('/')
    .get(advanceResults(Futsal, {
        path: 'reservation',
        select: 'reserverName startsAt endsAt'
    }), getFutsals)
    .post(protect, authorization('publisher', 'admin'), createFutsal)

router
    .route('/my')
    .get(protect, authorization('publisher', 'admin'), getMyFutsals)

router
    .route('/:id')
    .get(getFutsal)
    .delete(protect, authorization('publisher', 'admin'), deleteFutsal)
    .put(protect, authorization('publisher', 'admin'), updateFutsal)



module.exports = router;