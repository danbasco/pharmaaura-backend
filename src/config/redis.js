import { createClient } from 'redis';
import dotenv from 'dotenv';
import dns from 'dns/promises';

dotenv.config();

// This module used to perform a top-level await to connect to Redis which
// blocked module import and could cause hangs/cold-start issues in serverless
// environments (like Vercel). Instead we implement a lazy connect that:
// - does not block import
// - caches the client on globalThis to reuse between invocations
// - attempts multiple candidate URLs but skips hostnames that don't resolve
// - uses a short connection timeout to avoid long blocking waits

const providedUrl = process.env.REDIS_STORAGE_REDIS_URL;
let urlsToTry = [];

if (providedUrl) {
  urlsToTry = [providedUrl];
} else if (process.env.NODE_ENV !== 'production') {
  // in local/dev we try container host and loopback for convenience
  urlsToTry = ['redis://redis:6379', 'redis://127.0.0.1:6379'];
} else {
  // in production (e.g. Vercel) don't attempt localhost/container addresses
  // when no REDIS URL is provided — cache will be disabled.
  urlsToTry = [];
}

const CONNECTION_TIMEOUT_MS = 3000;

function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

async function hostnameResolves(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    await dns.lookup(hostname);
    return true;
  } catch (e) {
    return false;
  }
}

async function createAndConnect(url) {
  const client = createClient({ url });
  client.on('error', (err) => {
    console.error(`Redis Client Error (${url})`, err);
  });
  await timeout(client.connect(), CONNECTION_TIMEOUT_MS);
  console.info(`Connected to Redis at ${url}`);
  return client;
}

async function ensureClient() {
  // reuse existing client stored on globalThis
  if (globalThis.__redisClient && globalThis.__redisClient.isReady) {
    return globalThis.__redisClient;
  }
  // if no candidate URLs (e.g. production without REDIS configured),
  // don't attempt to connect — leave cache disabled.
  if (!urlsToTry || urlsToTry.length === 0) {
    globalThis.__redisClient = null;
    console.info('No Redis URL configured; skipping Redis connection. Cache disabled.');
    return null;
  }

  // try provided URL first, otherwise iterate candidates
  for (const url of urlsToTry) {
    // skip hostnames that don't resolve from this runtime to avoid long ENOTFOUND
    if (!(await hostnameResolves(url))) {
      console.info(`Skipping Redis URL ${url}: hostname not resolvable from this host`);
      continue;
    }
    try {
      const client = await createAndConnect(url);
      // mark and cache
      globalThis.__redisClient = client;
      return client;
    } catch (err) {
      console.warn(`Failed to connect to Redis at ${url}: ${err.message}`);
      // try next
    }
  }

  // if none connected, leave __redisClient unset (null) and return null
  globalThis.__redisClient = null;
  console.error('Could not connect to any Redis instance. Cache will be disabled.');
  return null;
}

export async function getClient() {
  return ensureClient();
}

export const getCache = async (key) => {
  const client = await getClient();
  if (!client) return null;
  const value = await client.get(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const setCache = async (key, value, ttlSeconds = 60) => {
  const client = await getClient();
  if (!client) return;
  const storeValue = typeof value === 'string' ? value : JSON.stringify(value);
  if (ttlSeconds > 0) {
    await client.setEx(key, ttlSeconds, storeValue);
  } else {
    await client.set(key, storeValue);
  }
};

export const delCache = async (key) => {
  const client = await getClient();
  if (!client) return;
  await client.del(key);
};

export default getClient;
