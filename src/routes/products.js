const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', auth, isAdmin, productController.create);
router.put('/:id', auth, isAdmin, productController.update);
router.delete('/:id', auth, isAdmin, productController.remove);

module.exports = router;
