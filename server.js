const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors')
const morgan = require('morgan');
const connectDB = require('./configs/db');
const cookieParser = require('cookie-parser');
const errorHandler = require('./src/errors/api-error-handler');

// corsConfig
// const corsOptions = {
//     origin: 'http://http://localhost:3000/',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }


// Initializing environment vairables
dotenv.config({
    path: './configs/config.env'
});

// Connect to mangodb database
connectDB();


const app = express()

// Routes files
const futsalsRoutes = require('./src/routes/futsals');
const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth');
const reservationRoutes = require('./src/routes/reservations');
const reviewsRoutes = require('./src/routes/reviews');

// Body parser
app.use(express.json());

// Cookies parser
app.use(cookieParser())

// Using morgan
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Use of cors 
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', "DELETE"],
    credentials: true
  }));

// Adding routes middlewares
app.use('/api/v1/futsals', futsalsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reservations', reservationRoutes);
app.use('/api/v1/reviews', reviewsRoutes);



// Error handler 
app.use(errorHandler);

// Environment variables 
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV;

const server = app.listen(PORT, () => {
    console.log(`Server Running in ${ENVIRONMENT} PORT ${PORT}. Link: http://localhost:${PORT}/`.yellow.bold)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Unhandled Rejection: ${err.message}`.red);
    // Close server and Exit process
    server.close(() => process.exit(1))
})