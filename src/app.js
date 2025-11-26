import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get("/", (req, res) => {
  res.send({ message: "PharmaAura Backend is Running." });
});


app.use(errorHandler);

export default app;
