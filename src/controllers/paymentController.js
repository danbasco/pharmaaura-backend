import Order from '../models/Order.js';

export const confirm = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  // mock payment approved
  order.status = 'confirmado';
  await order.save();
  res.json({ ok: true, status: order.status });
};
