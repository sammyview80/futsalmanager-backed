// sendResponse helper function 
const {sendResponse} = require('../helpers/response');

// asyncHandler import 
const asyncHandler = require('../helpers/asyncHandler');

// Model futsal
const ApiError = require('../errors/ApiError');
const Futsal = require('../models/Futsal');
const Review = require('../models/Review');



// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/futsal/:futsalId/reviews
// @access  Public
exports.getReviews = asyncHandler( async (req, res, next) => {
    if(req.params.futsalId){
        const futsal = await Futsal.findById(req.params.futsalId);

        if(!futsal){
            return next(
                ApiError.notfound(`Fustal of id: ${req.params.futsalId} couldn't be found.`)
            )
        }

        const reviews = await Review.find({futsal: req.params.futsalId});

        return sendResponse(res, {
            status: "Sucess",
            data: reviews
        }, 200, 'application/json');
    }

    return sendResponse(res, res.advanceResults, 200, 'application/json')
});

// @desc    Get single
// @route   GET /api/v1/reviews/:id
// @access  Public

exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'futsal',
        select: 'name status'
    })

    if (!review){
        return next(
            ApiError.notfound(`Reviews of id: ${review} couldn't found.`)
        )
    }
    return sendResponse(res, {
        status: "Sucess",
        data: review
    }, 200, 'application/json')
});


// @desc    Add Reviews
// @route   POST /api/v1/futsal/:futsalId/reviews
// @access  Private

exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.futsal = req.params.futsalId;
    req.body.user = req.user.id;


    const futsal = await Futsal.findById(req.params.futsalId);

    if(!futsal){
        return next(
            ApiError.notfound(`Futsal of id: ${req.params.futsalId} couldn't be found.`)
        )
    };

    const review = await Review.create(req.body);

    return sendResponse(res, {
        status: 'Sucess',
        data: review
    }, 200, 'application/json')
});


// @desc    Update Reviews
// @route   PUT /api/v1/reviews/:id
// @access  Private

exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if(!review){
        return next(
            ApiError.notfound(`Review of id: ${req.params.id} couldn't be found.`)
        )
    }

    // Make sure review belong to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            ApiError.unauthorized(`Unauthorized.`)
        )
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    });

    return sendResponse(res, {
        status: "Sucess",
        data: review
    }, 200, 'applicaton/json')
});

// @desc    Delete reviews
// @route   DELETE /api/v1/reviews/:id
// @access  Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    
    if(!review){
        return next(
            ApiError.notfound(`Review of id: ${req.params.id} couldn't be found.`)
            )
        }
            
    // Make sure review belong to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            ApiError.unauthorized(`Unauthorized.`)
            )
        }
    await review.remove();
    
    return sendResponse(res, {
        data: [],
        message: "sucess deletion"
    }, 200, 'application/json')
});

