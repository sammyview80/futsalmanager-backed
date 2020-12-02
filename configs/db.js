const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(
        process.env.MONGO_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true 
        }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
}

// const samanMapquest = {
//     GEOCODER_PROVIDER=mapquest
//     GEOCODER_API_KEY=cvRfT9REdQJI9jm70VYxvTj5QO9np7yV
// }

module.exports = connectDB;

