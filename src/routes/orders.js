const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.use(auth);

router.post('/create', orderController.create);
router.get('/:id', orderController.getById);
router.get('/user', orderController.getUserOrders);
router.get('/track/:id', orderController.track);

module.exports = router;
