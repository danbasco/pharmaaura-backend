const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const cartController = require('../controllers/cartController');

router.use(auth);

router.post('/add', cartController.add);
router.delete('/remove/:productId', cartController.remove);
router.get('/', cartController.get);

module.exports = router;
