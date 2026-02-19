import dotenv from 'dotenv';
dotenv.config({ path: 'backend/config/config.env' });

import express from 'express';
import cors from 'cors';
import product from './routes/productRoutes.js';
import user from './routes/userRoutes.js';
import order from './routes/orderRoutes.js';
import payment from './routes/paymentRoutes.js';
import errorHandleMiddleware from './middleware/error.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const app = express();

// CORS — allow frontend dev server & same origin in production
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,          // allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware
app.use(express.json({ limit: '10mb' }));        // larger limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: false }));

// Routes
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);

// Error middleware must be last
app.use(errorHandleMiddleware);

export default app;
