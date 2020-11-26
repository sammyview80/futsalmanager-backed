const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    reserverName: {
        type: String,
        required: [true, 'Please provide use the name']
    },
    description: {
        type: String,
        maxlength: [100, 'Maximum length for description is 100 character.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User should be authenticated.']
    },
    futsal: {
        type: mongoose.Schema.ObjectId,
        ref: 'Futsal',
        required: [true, 'Fustal to be reserve is required.']
    },
    verifiedNo: {
        type: [Number],
        required: [true, 'Verified no is required for reservation.'],
    },
    email: {
        type: [String],
        required: [true, 'Please add email.'],
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email.'
        ]
    },
    startsAt: {
        type: Date,
        required: [true, 'Starting date is required.'],
    },
    endsAt: {
        type: Date, 
        required: [true, 'Ending date is required.']
    }
})


module.exports = mongoose.model('Reservation', ReservationSchema);