import Product from '../models/Product.js';
import { removeProductFromAllCarts } from './cartService.js';
import { getCache, setCache, delCache } from '../config/redis.js';

export const getAll = async () => {
  // const cacheKey = 'products:all';
  // const cached = await getCache(cacheKey);
  // if (cached) return cached;

  console.log('Attempting to fetch products directly from database...');
  const products = await Product.find().lean();
  console.log('Successfully fetched products.');
  // await setCache(cacheKey, products, 60);
  return products;
};

export const getById = async (id) => {
  return await Product.findById(id).lean();
};

// Falta fazer lógica de validação
export const create = async (data) => {
  const created = await Product.create(data);
  // invalidate list cache
  await delCache('products:all');
  return created;
};

export const update = async (id, data) => {
  const updated = await Product.findByIdAndUpdate(id, data, { new: true });
  await delCache('products:all');
  if (updated) await delCache(`product:${id}`);
  return updated;
};

export const remove = async (id) => {
  const removed = await Product.findByIdAndDelete(id);
  if (!removed) throw Object.assign(new Error('Product not found'), { status: 404 });

  // After deleting the product, remove it from all carts
  await removeProductFromAllCarts(removed._id);

  // invalidate caches
  await delCache('products:all');
  await delCache(`product:${id}`);

  return removed;
};
