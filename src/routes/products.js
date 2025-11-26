import express from 'express';
const router = express.Router();

import * as productController from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', auth, isAdmin, productController.create);
router.put('/:id', auth, isAdmin, productController.update);
router.delete('/:id', auth, isAdmin, productController.remove);

export default router;
