const { sendResponse } = require('../helpers/response');
const ApiError = require('./ApiError');

const errorHandler = (error, req, res, next) => {

    // Log to console fro dev
    console.log(error);
    let err = {...error};
    err.message = error.message;

    // Mongoose bad ObjectId
    if(error.name === 'CastError'){
        const message = `Resources not found with id of ${error.value}`;
        err = ApiError.notfound(message);
    }
    // Mongoose duplicate key
    if(error.code === 11000) {
        const message = `Duplicate field value entered ${error.value}`;
        err = ApiError.duplicateField(message);
    }
    // Mongoose validation error
    if(error.name === 'ValidationError'){
        const message = Object.values(error.errors).map(val => val.message);
        err = ApiError.validationError(message);
    }
    

    sendResponse(res, {
        sucess: 'Failed',
        error: err.message
    }, err.code || 500, 'application/json')
}

module.exports = errorHandler;