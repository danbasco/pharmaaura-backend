import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (userId) => {
  return Cart.findOne({ user: userId }).populate('items.product');
};

export const addItem = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  if (product.stock < quantity) throw Object.assign(new Error('Not enough stock'), { status: 400 });

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const item = cart.items.find((i) => i.product.toString() === productId.toString());
  if (item) {
    if (product.stock < item.quantity + quantity) throw Object.assign(new Error('Not enough stock'), { status: 400 });
    item.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return Cart.findById(cart._id).populate('items.product');
};

export const removeItem = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw Object.assign(new Error('Cart not found'), { status: 404 });
  cart.items = cart.items.filter((i) => i.product.toString() !== productId.toString());
  await cart.save();
  return Cart.findById(cart._id).populate('items.product');
};
