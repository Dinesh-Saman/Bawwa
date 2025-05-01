import express from 'express';
import NutritionController from '../controllers/nutritionController.js';

const router = express.Router();

router.get('/', NutritionController.getAllNutrition);
router.post('/', NutritionController.createNutrition);
router.put('/:id', NutritionController.updateNutrition);
router.delete('/:id', NutritionController.deleteNutrition);
router.get('/latest', NutritionController.getLatestNutrition);
router.delete('/latest', NutritionController.deleteLatestNutrition);

export default router;