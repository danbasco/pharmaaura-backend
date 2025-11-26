const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/products', require('./products'));
router.use('/cart', require('./cart'));
router.use('/orders', require('./orders'));
router.use('/payments', require('./payments'));

router.get('/', (req, res) => res.json({ ok: true, name: 'PharmaAura API' }));

module.exports = router;
