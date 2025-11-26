const cartService = require('../services/cartService');

exports.add = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;
  const cart = await cartService.addItem(userId, productId, quantity);
  res.status(200).json(cart);
};

exports.remove = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const cart = await cartService.removeItem(userId, productId);
  res.json(cart);
};

exports.get = async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.getCart(userId);
  res.json(cart);
};
