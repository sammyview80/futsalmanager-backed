const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./configs/db');
const errorHandler = require('./src/errors/api-error-handler');


// Initializing environment vairables
dotenv.config({
    path: './configs/config.env'
});

// Connect to mangodb database
connectDB();


const app = express()

// Routes files
const futsalsRoutes = require('./src/routes/futsals');

// Body parser
app.use(express.json());

// Adding routes middlewares
app.use('/api/v1/futsals', futsalsRoutes);


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