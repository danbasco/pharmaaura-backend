import { createClient } from 'redis';
import dotenv from 'dotenv';
import dns from 'dns/promises';

dotenv.config();

// If user provided a full URL use it. Otherwise try docker service name first
// (when app runs inside docker-compose) and fall back to localhost for
// local development.
const providedUrl = process.env.REDIS_STORAGE_REDIS_URL;
const urlsToTry = providedUrl
  ? [providedUrl]
  : ['redis://redis:6379', 'redis://127.0.0.1:6379'];

let client = null;
let connectedUrl = null;

async function tryConnect() {
  for (const url of urlsToTry) {
    // Before attempting a connection, check if the hostname resolves to avoid
    // noisy ENOTFOUND errors when the host (e.g. 'redis') isn't visible from
    // the current network namespace (common when running the app on host).
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname;
      try {
        await dns.lookup(hostname);
      } catch (dnsErr) {
        console.info(`Skipping Redis URL ${url}: hostname ${hostname} not resolvable from this host`);
        continue;
      }
    } catch (e) {
      // If URL parsing fails, continue to try connecting — let the client handle it.
    }

    const c = createClient({ url });
    // Attach per-client error handler for better diagnostics
    c.on('error', (err) => {
      console.error(`Redis Client Error (${url})`, err);
    });
    try {
      await c.connect();
      console.info(`Connected to Redis at ${url}`);
      client = c;
      connectedUrl = url;
      return;
    } catch (err) {
      console.warn(`Failed to connect to Redis at ${url}: ${err.message}`);
      try {
        await c.quit();
      } catch (e) {
        // ignore
      }
    }
  }
  console.error('Could not connect to any Redis instance. Cache will be disabled.');
}

// top-level await is allowed in ESM. Try to connect now so other modules can use cache.
await tryConnect();

export const getCache = async (key) => {
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
  if (!client) return;
  const storeValue = typeof value === 'string' ? value : JSON.stringify(value);
  if (ttlSeconds > 0) {
    await client.setEx(key, ttlSeconds, storeValue);
  } else {
    await client.set(key, storeValue);
  }
};

export const delCache = async (key) => {
  if (!client) return;
  await client.del(key);
};

export default client;
