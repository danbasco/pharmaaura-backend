import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    mongoose.set('debug', true); // Ativa o modo de depuração do Mongoose

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    // Adiciona listeners de eventos para diagnóstico detalhado
    const conn = mongoose.connection;
    conn.on('connecting', () => {
      console.log('Mongoose: status [connecting]...');
    });
    conn.on('connected', () => {
      console.log('Mongoose: status [connected] to', conn.host);
    });
    conn.on('error', (err) => {
      console.error('Mongoose: status [error]', err);
    });
    conn.on('disconnected', () => {
      console.log('Mongoose: status [disconnected]');
    });

    // Reuse existing global connection in serverless environments
    if (globalThis.__mongoConnected) {
      console.log('Mongoose: Reusing existing connection.');
      return;
    }

    console.log('Mongoose: Attempting new connection...');
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'example',
      serverSelectionTimeoutMS: 10000, // Aumenta o timeout para tentar conectar
    });
    globalThis.__mongoConnected = true;
    console.log('Database connection promise resolved.');

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error after initial connect:', err);
    });
  } catch (error) {
    console.error('Database connection error during initial connect:', error);
    throw error;
  }
};

export default { connectDB };
