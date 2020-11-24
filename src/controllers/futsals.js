// sendResponse helper function 
const {sendResponse} = require('../helpers/response');

// asyncHandler import 
const asyncHandler = require('../helpers/asyncHandler');

// Model futsal
const Futsal = require('../models/Futsal');
const ApiError = require('../errors/ApiError');

//@des      Get all futsals
//@route    GET /api/v1/futsals
//@access   Public
exports.getFutsals = asyncHandler( async (req, res, next) => {
    return sendResponse(res, res.advanceResults, 200, 'application/json')
})

//@des      Get single futsals
//@route    GET /api/v1/futsals/:id
//@access   Public
exports.getFutsal = asyncHandler( async (req, res, next) => {
    const futsal = await Futsal.findById(req.params.id);

    if(!futsal){
        return next(
            ApiError.notfound(`id of ${req.params.id} couldn't found.`)
        )
    }
    return sendResponse(res, {
        status: "Sucess",
        data: futsal
    }, 200, 'application/json')
});

//@des      Create futsal 
//@route    POST /api/v1/futsals
//@access   Private: [admin, owner]
exports.createFutsal = asyncHandler( async (req, res, next) => {
    const futsal = await Futsal.create(req.body);
    
    return sendResponse(res, {
        status: "Sucess",
        data: futsal
    }, 200, 'application/json')
});




//@des      Update futsal 
//@route    PUT /api/v1/futsals/:id
//@access   Private: [admin, owner]
exports.updateFutsal = asyncHandler( async (req, res, next) => {
    const futsal = await Futsal.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    })
    
    if(!futsal){
        return next(
            new ApiError(400, `Couldn't perform action.`)
            )
        }
        
        
        return sendResponse(res, {
            status: "Sucess",
            data: futsal
        }, 200, 'application/json')
    });

    
//@des      Delete futsal 
//@route    Delete /api/v1/futsals/:id
//@access   Private: [admin, owner]
exports.deleteFutsal = asyncHandler( async (req, res, next) => {
    const futsal = await Futsal.findByIdAndDelete(req.params.id);
    
    return sendResponse(res, {
        status: "Sucess",
        data: [],
        message: 'Deletetion sucess.'
    }, 200, 'application/json')
});