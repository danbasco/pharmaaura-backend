import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import database from './config/db.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;
let server = null;

async function start() {
  try {
    await database.connectDB();
    server = app.listen(PORT, () => {
      console.log(`App is listening on http://localhost:${PORT}/`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  try {
    if (server) {
      server.close(() => {
        console.log('HTTP server closed');
      });
    }
    try {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
      }
    } catch (e) {
      console.warn('Error disconnecting MongoDB', e);
    }
    try {
      const redisClient = globalThis.__redisClient;
      if (redisClient && redisClient.quit) {
        await redisClient.quit();
        console.log('Redis client closed');
      }
    } catch (e) {
      console.warn('Error closing Redis client', e);
    }
    setTimeout(() => process.exit(0), 1000);
  } catch (e) {
    console.error('Error during shutdown', e);
    process.exit(1);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
