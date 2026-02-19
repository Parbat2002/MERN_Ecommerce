import dotenv from 'dotenv';
dotenv.config({ path: 'backend/config/config.env' });
console.log('FRONTEND_URL:', process.env.FRONTEND_URL)

import app from './app.js';
import { connectMongoDatabase } from './config/db.js';
import { v2 as cloudinary } from 'cloudinary';

// Connect Database
connectMongoDatabase();

// Configure Cloudinary (after dotenv is loaded)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Handle uncaught exception errors
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Uncaught Exception');
    process.exit(1);
});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');
    server.close(() => {
        process.exit(1);
    });
});
