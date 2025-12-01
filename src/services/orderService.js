import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = async (userId, { address, deliveryMethod = 'retirada' }) => {

  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) throw Object.assign(new Error('Cart is empty'), { status: 400 });


  let total = 0;
  const items = [];
  for (const it of cart.items) {

    const product = await Product.findById(it.product._id);
    if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
    if (product.stock < it.quantity) throw Object.assign(new Error('Not enough stock'), { status: 400 });
    
    const subtotal = product.price * it.quantity;
    items.push({ product: product._id, name: product.name, price: product.price, quantity: it.quantity, subtotal });
    total += subtotal;
  }

  // decrement stock
  for (const it of cart.items) {
    await Product.findByIdAndUpdate(it.product._id, { $inc: { stock: -it.quantity } });
  }

  const order = await Order.create({ user: userId, items, address, deliveryMethod, total });
  // clear cart
  cart.items = [];
  await cart.save();
  return order;
};

export const getById = async (id, user) => {
  const order = await Order.findById(id).populate('items.product');
  if (!order) return null;
  // only owner or admin
  if (order.user.toString() !== user._id.toString() && user.role !== 'admin') return null;
  return order;
};

export const getByUser = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const track = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
  // simulate progression based on elapsed seconds since creation
  const elapsed = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  const stages = ['pendente','confirmado','separado','enviado','entregue'];
  const idx = Math.min(stages.length - 1, Math.floor(elapsed / 10));
  return stages[idx];
};
