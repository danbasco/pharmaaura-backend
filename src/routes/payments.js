import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as paymentController from '../controllers/paymentController.js';

router.use(auth);

router.post('/confirm', paymentController.confirm);

export default router;
