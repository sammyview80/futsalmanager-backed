const { sendResponse } = require('../helpers/response');
const ApiError = require('./ApiError');

const errorHandler = (error, req, res, next) => {
    let err = {...error};
    err.message = error.message;
    err.code = 500

    if(error instanceof ApiError){
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
    }
    // Log to console fro dev
    console.log(err);

    sendResponse(res, {
        sucess: 'failed',
        error: err.message
    }, err.code, 'application/json')
}

module.exports = errorHandler;