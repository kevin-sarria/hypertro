// Infrastructure HTTP Routes: nutrition.routes.ts

import { Router } from 'express';
import { NutritionController } from '../controllers/NutritionController';
import { authenticate } from '../middlewares/authenticate';
import { validateBody } from '../middlewares/validateBody';
import {
  nutritionLogSchema,
  tdeeSchema
} from '../../../application/validators/nutrition.schemas';

export function createNutritionRouter(controller: NutritionController): Router {
  const router = Router();

  // Cálculo de TDEE público o para atletas
  router.post('/tdee', validateBody(tdeeSchema), controller.calculateTdee);

  // Registro y consulta de comidas protegidos
  router.post('/log', authenticate, validateBody(nutritionLogSchema), controller.logMeal);
  router.get('/daily', authenticate, controller.getDailyLogs);

  return router;
}
