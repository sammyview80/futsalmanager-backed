const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true,'Please add a title'],
        maxlength: 100
    },
    text: {
        type:String,
        required: [true, 'Please add a text.']
    },
    rating: {
        type:Number,
        min:1,
        max: 10,
        required: [true, 'Please add rating between 1 and 10.']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    futsal: {
        type: mongoose.Schema.ObjectId,
        ref: 'Futsal',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    }
})


// Prevent user form submitting more than one reviews per bootcampp
ReviewSchema.index({
    futsal: 1, 
    user: 1
}, {unique: true})

// Static method to get average of course tuitions 
ReviewSchema.statics.getAverageRating = async function(futsalId) {

    const [obj] = await this.aggregate([
        {
            $match: {futsal: futsalId}
        },
        {
            $group: {
                _id: '$futsal',
                averageRating: { $avg: '$rating'}
            }
        }
    ]);
    console.log(obj);
    try {
        await this.model('Futsal').findByIdAndUpdate(futsalId, {
            averageRating: obj.averageRating
        })
    } catch (err) {
        console.log(err);
    }
}

// Call getAverage cost after save
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.futsal)
})
// Call getAverage cost before remove
ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.futsal)
})

module.exports = mongoose.model('Review', ReviewSchema);