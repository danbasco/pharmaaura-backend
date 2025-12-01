import express from 'express';
const router = express.Router();
import authRoutes from './auth.js';
import productRoutes from './products.js';
import cartRoutes from './cart.js';
import orderRoutes from './orders.js';
import paymentRoutes from './payments.js';

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);

router.get('/', (req, res) => res.json({ ok: true, name: 'PharmaAura API' }));

export default router;
