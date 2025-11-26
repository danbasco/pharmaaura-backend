const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

router.use(auth);

router.post('/confirm', paymentController.confirm);

module.exports = router;
