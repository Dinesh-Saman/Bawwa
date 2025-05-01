import Nutrition from '../models/Nutrition.js';
import validator from 'validator';

class NutritionController {
  // Get all nutrition records
  static async getAllNutrition(req, res) {
    try {
      const nutritionData = await Nutrition.find().populate('petId');
      res.json(nutritionData);
    } catch (error) {
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
  }

  // Create a new nutrition record
  static async createNutrition(req, res) {
    try {
      const { petId, foodName, portionSize, feedingFrequency, calories } = req.body;

      if (portionSize <= 0) {
        return res.status(400).json({ message: 'Portion size must be positive' });
      }

      const nutrition = new Nutrition({
        petId,
        foodName,
        portionSize,
        feedingFrequency,
        calories
      });

      const newNutrition = await nutrition.save();
      res.status(201).json(newNutrition);
    } catch (error) {
      res.status(400).json({ message: 'Validation error: ' + error.message });
    }
  }

  // Update a nutrition record
  static async updateNutrition(req, res) {
    try {
      const nutrition = await Nutrition.findById(req.params.id);
      if (!nutrition) {
        return res.status(404).json({ message: 'Nutrition record not found' });
      }

      // Update only provided fields
      const updates = req.body;
      Object.keys(updates).forEach(key => {
        nutrition[key] = updates[key];
      });

      const updatedNutrition = await nutrition.save();
      res.json(updatedNutrition);
    } catch (error) {
      res.status(400).json({ message: 'Validation error: ' + error.message });
    }
  }

  // Delete a nutrition record
  static async deleteNutrition(req, res) {
    try {
      const nutrition = await Nutrition.findByIdAndDelete(req.params.id);
      if (!nutrition) {
        return res.status(404).json({ message: 'Nutrition record not found' });
      }
      res.json({ message: 'Nutrition record deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
  }

  // Get latest nutrition record
  static async getLatestNutrition(req, res) {
    try {
      const latestRecord = await Nutrition.findOne().sort({ _id: -1 });
      if (!latestRecord) {
        return res.status(404).json({ message: 'No nutrition records found' });
      }
      res.json(latestRecord);
    } catch (error) {
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
  }

  // Delete latest nutrition record
  static async deleteLatestNutrition(req, res) {
    try {
      const latestRecord = await Nutrition.findOne().sort({ _id: -1 });
      if (!latestRecord) {
        return res.status(404).json({ message: 'No nutrition records found' });
      }
      await latestRecord.deleteOne();
      res.json({ message: 'Latest nutrition record deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
  }
}

export default NutritionController;