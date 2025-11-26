import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

export default app;
