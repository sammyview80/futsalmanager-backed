const mongoose = require('mongoose');
const slugify = require('slugify');
const ApiError = require('../errors/ApiError');

// Custom validator for mongooseSchema 
const uniqueNameValidator = () =>  async function(v){
    const count = await mongoose.models.Futsal.countDocuments({name: v });
    if(count > 0){
        return Promise.reject(new ApiError(409, `Duplicate name`))
    }
}

const FutsalSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Futsal name is required.'],
        unique: true,
        validate: {
            // Validation for unique name
            validator: uniqueNameValidator()
        }
    },
    status: {
        type: String, 
        enum: ['open', 'closed'],
        default: 'open'
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
      slug: String,
      description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description  cannot be more than 50 characters.']
    },
    price: {
        type: Number,
        required: [true, 'Price is required.']
    },
    contactNumber: {
        type: Number,
        required: [true, 'Contact Number is required.']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email.'
        ]
    },
    address: {
        type: String,
        required: [true, 'Address is required.']
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must cannot be more than 10']
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    owner: {
        name: {
            type: String, 
            required: [true, 'Owner name required.']
        },
        address: {
            type: String, 
            required: [true, 'Owner address required.']
        },
        contact: {
            type: String, 
            required: [true, 'Owner contact required.']
        },
        email: {
            type: String,
            match: [
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please add a valid email.'
            ]
        }
        
    },
    openAt: {
        type:String,
        required: [true, 'Opening time required.'],
    },
    closeAt: {
        type: String,
        required: [true, 'Closing time required.']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {strict: true})

// Create bootcamp slug from the name 
FutsalSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// Reservation system is remaining 
// ReservedByUser 
// Time stamp



module.exports = mongoose.model('Futsal', FutsalSchema);
