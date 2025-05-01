import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [
    {
      accessoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accessory', required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  transactionId: { type: String },
});

// Export as default
export default mongoose.model('Order', orderSchema);