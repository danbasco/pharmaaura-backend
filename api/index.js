import app from '../src/app.js';
import database from '../src/config/db.js';

// Vercel (serverless) entry point. This file is invoked per-request. We ensure
// the DB is connected on cold-start and then delegate to the Express app.

export default async function handler(req, res) {
  try {
    // Diagnostic logs (do not print secret values)
    try {
      const present = (name) => !!process.env[name];
      const candidates = [
        'MONGODB_URI',
        'MONGODB_DB_NAME',
        'REDIS_STORAGE_REDIS_URL',
        'REDIS_URL',
        'REDIS_TLS_URL',
        'NODE_ENV',
      ];
      const found = candidates.filter(present);
      console.info('Env presence:', found.length ? found.join(', ') : 'none');

      // If a redis URL is provided, log only its hostname (not the full value)
      const redisEnv = process.env.REDIS_STORAGE_REDIS_URL || process.env.REDIS_URL || process.env.REDIS_TLS_URL;
      if (redisEnv) {
        try {
          const u = new URL(redisEnv);
          console.info('Redis hostname (from env):', u.hostname);
        } catch (e) {
          console.info('Redis env is set but could not parse hostname');
        }
      }
    } catch (diagErr) {
      console.warn('Env diagnostic failed', diagErr);
    }

    if (!globalThis.__mongoConnected) {
      try {
        await database.connectDB();
      } catch (e) {
        console.error('Database connection failed in serverless handler', e);
        return res.status(500).json({ error: 'Database connection error' });
      }
    }

    // When deployed on Vercel the function is mounted at `/api` and the
    // incoming `req.url` typically does NOT include the `/api` prefix. The
    // Express `app` in `src/app.js` mounts the router under `/api` as well,
    // so we must ensure the request path includes `/api` before delegating
    // to the app. This keeps existing clients working (they call `/api/...`).
    if (!req.url.startsWith('/api')) {
      req.url = `/api${req.url}`;
    }

    // Delegate to the Express app (Express apps are request handlers).
    return app(req, res);
  } catch (err) {
    console.error('Serverless handler error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
