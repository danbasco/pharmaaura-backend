import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import * as cartController from '../controllers/cartController.js';

router.use(auth);

router.post('/add', cartController.add);
router.delete('/remove/:productId', cartController.remove);
router.get('/', cartController.get);

export default router;
