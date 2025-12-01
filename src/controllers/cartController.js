import * as cartService from '../services/cartService.js';

export const add = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1 } = req.body;
  const cart = await cartService.addItem(userId, productId, quantity);
  res.status(200).json(cart);
};

export const remove = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const cart = await cartService.removeItem(userId, productId);
  res.json(cart);
};

export const get = async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.getCart(userId);
  res.json(cart);
};
