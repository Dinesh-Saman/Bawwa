import mongoose from 'mongoose';

const accessorySchema = new mongoose.Schema({
  petType: { type: String, required: true, enum: ['dog', 'cat', 'rabbit'] },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Accessory', accessorySchema);