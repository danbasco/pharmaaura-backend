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

    // Delegate to the Express app (works because app is a function (req,res)).
    return app(req, res);
  } catch (err) {
    console.error('Serverless handler error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
