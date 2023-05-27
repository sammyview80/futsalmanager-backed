// sendResponse helper function 
const {sendResponse} = require('../helpers/response');

// asyncHandler import 
const asyncHandler = require('../helpers/asyncHandler');

// Model futsal
const Reservation = require('../models/Reservation');
const ApiError = require('../errors/ApiError');
const Futsal = require('../models/Futsal');

//@des      Get all reservation
//@route    GET /api/v1/reservations
//@access   Private: Admin/ Reserver
exports.getReservations = asyncHandler( async (req, res, next) => {
    // Seperate response for admin ie return all the reservations 
    // When the reserver request 
    // 1. Try to get the reservation made by the user from db
    // 2. If find then send response
    //  3. Else return error response

    if(req.user.role === 'admin'){
        // Yes there is advanceResults availabels
        return sendResponse(res, res.advanceResults, 200, 'application/json');
    }

    // Delete the advance results is the user role is not admin
    res.advanceResults = undefined;

    // Get all the reservation based on the userId
    let reservations = await Reservation.find({user: req.user.id}).populate({
        path: 'futsal',
        select: 'name status'
    });

    // If there is no any reservation from the userId then send error.
    if(!reservations){
        return next(
            new ApiError(400, `No reservations found with id: ${req.user.id}`)
        )
    }

    // Yes there is reservations with the userId
    return sendResponse(res, {
        status: "Success",
        data: reservations
    }, 200, 'application/json');
});


//@des      Get single reservation
//@route    GET /api/v1/reservations/:id
//@access   Private: Admin/ Reserver
exports.getReservation = asyncHandler( async (req, res, next) => {
    // If the request is from admin no any validation with the user
    // Else the request is from the user then 
    // 1. Get reservation with the ReservationId
    // 1.1 If found then proceed to step 2.
    // 1.2 Else thow error with msg and code
    // 2. Check the reservation.user to the req.user._id
    // 2.1 If matched then sendResponse 
    // 2.2 Else throw error message 

    // Get the reservation with the id
    const reservation = await Reservation.findById(req.params.id);

    // Throw error if the reservation don't found
    if(!reservation){
        return next(
            ApiError.notfound(`Reservation with id of ${req.params.id} couldn't be found.`)
        )
    }

    // If found.

    // Handle the admin request differently for admin
    if(req.user.role === 'admin'){
        return sendResponse(res, {
            status: "Sucess",
            data: reservation
        }, 200, 'application/json')
    }

    // Request is from the user

    // Check the reservation.user to the req.user._id
    if(reservation.user.toString() !== req.user._id.toString()){
        // If the reservation.user don't match req.user._id
        return next(
            ApiError.unauthorized(`User of id: ${req.user._id} unauthorized.`)
        )
    }
    
    return sendResponse(res, {
        status: "Sucess",
        data: reservation
    }, 200, 'application/json')
});


//@des      Create reservation
//@route    POST /api/v1/futsals/:futsalId/reservations
//@access   Private: Admin/ user
exports.createReservation = asyncHandler( async (req, res, next) => {
    // Validate the futsal exist or not
    // If exists then create a reservation with req.body

    // Getting the futsal with id
    const futsal = await Futsal.findById(req.params.futsalId);

    // Checking the futsal exists or not
    if(!futsal){
        return next(
            ApiError.notfound(`Futsal of id ${req.params.futsalId} coun't be found`)
        )
    }

    // Add the userId and futsalId in req.body
    req.body.user = req.user._id
    req.body.futsal = req.params.futsalId

    // Get the reservations by the user
    let reservation = await Reservation.find({user: req.user._id});
    
        
    // Check the reservations is less than or equal to 3
    if(reservation.length >= 3){
        return next(
            ApiError.unprocessable(`A user can only reserve for 3 futsals.`)
        )
    } 

    // If the futsal exists then create a new model in db
    reservation = await Reservation.create(req.body);

    // After the creation in db 
    // Sending email with alert message
    // Sending message to the verified no.

    // If Promise resolve then send 200 response
    return sendResponse(res, {
        sucess: 'Sucess',
        data: reservation
    }, 200, 'application/json')
});


//@des      Update reservation
//@route    POST /api/v1/reservations/:id
//@access   Private: Admin/ user
exports.updateReservation = asyncHandler( async (req, res, next) => {
    // Get the reservation from db with id
    // 1. If cann't get the information the throw error
    // 2 .Else check the created user and requested user is same
    // 2.1 If same update the db with req.body
    // 2.2 Else throw unauthorized 

    // Get the reservation from db with id
    let reservation = await Reservation.findById(req.params.id);

    // If there is no reservation then throw id error
    if(!reservation){
        return next(
            ApiError.notfound(`Reservation of id ${req.params.id} couldn't be found.`)
        )
    }


    // Check the created user and requested user is same 
    if(reservation.user.toString() !== req.user._id.toString()){
        return next(
            ApiError.unauthorized(`User of id: ${req.user._id} unauthorized.`)
        )
    }
    
    // If same then update the db with req.body
    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // Send sucess response
    return sendResponse(res, {
        status: "Sucess",
        data: reservation
    }, 200, 'application/json')
});



//@des      Delete reservation
//@route    Delete /api/v1/reservations/:id
//@access   Private: Admin/ user
exports.deleteReservation = asyncHandler( async (req, res, next) => {

    // Get the reservation from db with id
    let reservation = await Reservation.findById(req.params.id);

    // If there is no reservation then throw id error
    if(!reservation){
        return next(
            ApiError.notfound(`Reservation of id ${req.params.id} couldn't be found.`)
        )
    }
    console.log(req.futsalId !== undefined);
    const LoginedUserFutsals = [];
    if(req.futsalId !== undefined){
        req.futsalId.forEach(element => {
            LoginedUserFutsals.push(element._id.toString())
        });
    }
    console.log(LoginedUserFutsals);
    console.log(reservation.futsal.toString());
    console.log(LoginedUserFutsals.includes(reservation.futsal.toString()))

    // Check the created user and requested user is same 
    if(reservation.user.toString() !== req.user._id.toString()){
        if(!LoginedUserFutsals.includes(reservation.futsal.toString())){
            return next(
                ApiError.unauthorized(`User of id: ${req.user._id} unauthorized.`)
            )
        }
    }
    
    // If same then delete 
    await Reservation.findByIdAndDelete(req.params.id);

    reservation = await Reservation.find({user: req.user._id});

    // Send sucess response
    return sendResponse(res, {
        status: "Sucess",
        data: reservation,
        message: 'Deletion Sucess'
    }, 200, 'application/json')
});