import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDatabase } from './config/db.js';

dotenv.config({ path: 'backend/config/config.env' });

connectMongoDatabase();

// Handle uncaught  exception errors

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Uncaught Exception');
  process.exit(1)
})

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Port ${port} `)
})

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to Unhandled Promise rejection');   
  server.close(() => {
    process.exit(1)
  })
})