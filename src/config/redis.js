import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.REDIS_STORAGE_REDIS_URL || 'redis://redis:6379';

if (!process.env.REDIS_STORAGE_REDIS_URL) {
  console.info('REDIS_STORAGE_REDIS_URL not set — using default redis://redis:6379 for local/dev');
}

const client = createClient({ url });

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// top-level await is allowed (ESM). Try to connect if URL provided.
if (url) await client.connect();

export const getCache = async (key) => {
  if (!url) return null;
  const value = await client.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const setCache = async (key, value, ttlSeconds = 60) => {
  if (!url) return;
  const storeValue = typeof value === 'string' ? value : JSON.stringify(value);
  if (ttlSeconds > 0) {
    await client.setEx(key, ttlSeconds, storeValue);
  } else {
    await client.set(key, storeValue);
  }
};

export const delCache = async (key) => {
  if (!url) return;
  await client.del(key);
};

export default client;
