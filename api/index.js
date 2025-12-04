import app from '../src/app.js';
import database from '../src/config/db.js';

// Vercel (serverless) entry point. This file is invoked per-request. We ensure
// the DB is connected on cold-start and then delegate to the Express app.

export default async function handler(req, res) {
  try {
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
