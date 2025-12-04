import mongoose from 'mongoose';

const connectDB = async () => {

  try {
    mongoose.set('strictQuery', true);

    const MONGODB_URI  = process.env.MONGODB_URI;

    if(!MONGODB_URI){
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    // Reuse existing global connection in serverless environments
    if (globalThis.__mongoConnected) {
      return;
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'example',
    });
    globalThis.__mongoConnected = true;
    console.log('Database connection successful');

  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }

};

export default { connectDB };
