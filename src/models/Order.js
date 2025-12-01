import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number, required: true },
  subtotal: { type: Number }
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    address: { type: String },
    deliveryMethod: { type: String, enum: ['retirada', 'delivery'], default: 'delivery' },
    status: { type: String, enum: ['pendente','confirmado','separado','enviado','entregue'], default: 'pendente' },
    total: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
