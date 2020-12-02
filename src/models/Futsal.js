const mongoose = require('mongoose');
const slugify = require('slugify');
const ApiError = require('../errors/ApiError');
const geocoder = require('../helpers/geoCoder');

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
        type: Date,
        required: [true, 'open time is required.'],
    },
    closeAt: {
        type: Date,
        required: [true, 'close time is required.'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

// Create bootcamp slug from the name 
FutsalSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// Geocode and create location field
FutsalSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    // Donot save address in DB
    this.address = undefined;
    next()
});

// Reverse populate with virtuals
FutsalSchema.virtual(
    'reservation', {
        ref: 'Reservation',
        localField: '_id',
        foreignField: 'futsal',
        justOne: false
    }
)
FutsalSchema.virtual(
    'reviews', {
        ref: 'Review',
        localField: '_id',
        foreignField: 'futsal',
        justOne: false
    }
)

// Cascade delete reviews and reservations when a futsal is deleted.
FutsalSchema.pre('remove', async function(next){
    await this.model('Reservation').deleteMany({
        futsal: this._id
    });
    next();
})


module.exports = mongoose.model('Futsal', FutsalSchema);
