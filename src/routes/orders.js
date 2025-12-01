import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

router.use(auth);

router.post('/create', orderController.create);
router.get('/user', orderController.getUserOrders);
router.get('/:id', orderController.getById);
router.get('/track/:id', orderController.track);

export default router;
