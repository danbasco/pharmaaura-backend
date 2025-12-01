import express from 'express';
const router = express.Router();
import authRoutes from './auth.js';

router.use('/auth', authRoutes);
router.use('/products', productRoutes);

router.get('/', (req, res) => res.json({ ok: true, name: 'PharmaAura API' }));

export default router;
