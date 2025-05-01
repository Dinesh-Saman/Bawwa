import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  petId: {
    type: String,
    required: [true, 'Pet ID is required'],
    trim: true
  },
  foodName: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true
  },
  portionSize: {
    type: Number,
    required: [true, 'Portion size is required'],
    min: [1, 'Portion size must be positive']
  },
  feedingFrequency: {
    type: String,
    enum: {
      values: ['daily', 'weekly', 'monthly'],
      message: 'Feeding frequency must be daily, weekly, or monthly'
    },
    required: [true, 'Feeding frequency is required']
  },
  calories: {
    type: Number,
    required: [true, 'Calories are required'],
    min: [1, 'Calories must be positive']
  }
}, {
  timestamps: true
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema);
export default Nutrition;