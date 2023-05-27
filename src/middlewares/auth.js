const ApiError = require("../errors/ApiError");
const asyncHandler = require("../helpers/asyncHandler");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Futsal = require("../models/Futsal");
const Reservation = require("../models/Reservation");


// Protect routes
exports.protect = asyncHandler( async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // Token from bearer authorization header
        token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies){
        // Token from cookie
        token = req.cookies.token;
    }

    // Make sure token exist
    if(!token){
        return next(
            ApiError.unauthorized('Assess Denied.')
        )
    }
    try {
        // Verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if(req.user.role === 'publisher'){
            req.futsalId = await Futsal.find({user: req.user._id});
            req.reservations = await Reservation.find();
        }
        
        console.log(req.reservations);

        next()
    } catch (err) {
        return next(
            ApiError.unauthorized('Assess Denied.')
        )
    }
});


// Authorizations
exports.authorization = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
                ApiError.unauthorized(`Unauthorized.`)
            )
        }
        next();
    }
}

