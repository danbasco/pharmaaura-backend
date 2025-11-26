import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import database from './config/db.js';

const app = express();
database.connectDB();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get("/", (req, res) => {
  res.send({ message: "PharmaAura Backend is Running." });
});

app.use((req, res) => {
    res.status(404).json({ message: `Cannot ${req.method} ${req.path}` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}/`);
  });