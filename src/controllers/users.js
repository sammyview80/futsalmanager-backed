// sendResponse helper function 
const {sendResponse} = require('../helpers/response');

// asyncHandler import 
const asyncHandler = require('../helpers/asyncHandler');

// Model futsal
const User = require('../models/User');
const ApiError = require('../errors/ApiError');

//@des      Get all futsals
//@route    GET /api/v1/futsals
//@access   Public
exports.getUsers = asyncHandler( async (req, res, next) => {
    return sendResponse(res, res.advanceResults, 200, 'application/json')
});


//@des      Get single futsals
//@route    GET /api/v1/futsals/:id
//@access   Public
exports.getUser = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(
            ApiError.notfound(`User of id ${req.params.id} couldn't found.`)
        )
    }
    return sendResponse(res, {
        status: 'Sucess',
        data: user
    }, 200, 'application/json')
});

//@des      Create user 
//@route    POST /api/v1/users
//@access   Private/admin

exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);

    return sendResponse(res, {
        status: 'Sucess',
        data: user,
        message: 'Creation success.'
    }, 200, 'application/json')
});


//@des      Update user 
//@route    PUT /api/v1/users:/id
//@access   Private/admin

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true
    });

    if(!user){
        return next(
            new ApiError(400, `Couldn't perform update.`)
        )
    }
    res.status(201).json({
        sucess: true, 
        data: user
    })
});


//@des      Delete user 
//@route    Delete /api/v1/users/:id
//@access   Private: admin
exports.deleteUser = asyncHandler( async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if(!user){
        return next(
            new ApiError(400, `Couldn't perform update.`)
        )
    }
    return sendResponse(res, {
        status: "Sucess",
        data: [],
        message: 'Deletetion sucess.'
    }, 200, 'application/json')
});