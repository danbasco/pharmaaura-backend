import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmaaura';

async function seed() {
  await mongoose.connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB_NAME || 'PharmaAura',
      });
  console.log('Connected to Mongo for seeding');

  // Create admin user if not exists
  const adminEmail = 'admin@pharmaaura.test';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hash = await bcrypt.hash('admin123', await bcrypt.genSalt(10));
    admin = await User.create({ name: 'Admin', email: adminEmail, password: hash, phone: '', address: '', role: 'admin' });
    console.log('Created admin:', adminEmail, 'password: admin123');
  } else {
    console.log('Admin already exists:', adminEmail);
  }

  // Create example products
  const products = [
    { name: 'Paracetamol 500mg', description: 'Analgesic and antipyretic', category: 'Analgesic', price: 9.9, stock: 200, image: '' },
    { name: 'Ibuprofeno 400mg', description: 'Anti-inflammatory', category: 'Anti-inflammatory', price: 12.5, stock: 150, image: '' },
    { name: 'Vitamina C 1000mg', description: 'Suplement', category: 'Supplement', price: 19.9, stock: 100, image: '' }
  ];

  for (const p of products) {
    const exists = await Product.findOne({ name: p.name });
    if (!exists) {
      await Product.create(p);
      console.log('Created product:', p.name);
    } else {
      console.log('Product exists:', p.name);
    }
  }

  console.log('Seeding finished');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error', err);
  process.exit(1);
});
