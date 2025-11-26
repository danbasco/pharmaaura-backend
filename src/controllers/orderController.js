const orderService = require('../services/orderService');

exports.create = async (req, res) => {
  const userId = req.user._id;
  const { address, deliveryMethod } = req.body;
  const order = await orderService.createOrder(userId, { address, deliveryMethod });
  res.status(201).json(order);
};

exports.getById = async (req, res) => {
  const order = await orderService.getById(req.params.id, req.user);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.getUserOrders = async (req, res) => {
  const orders = await orderService.getByUser(req.user._id);
  res.json(orders);
};

exports.track = async (req, res) => {
  const status = await orderService.track(req.params.id);
  res.json({ status });
};
