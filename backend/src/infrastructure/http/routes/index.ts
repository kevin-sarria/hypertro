// Infrastructure HTTP Routes: Root Router

import { Router } from 'express';
import { Container } from '../../container';
import { createAuthRouter } from './auth.routes';
import { createWorkoutRouter } from './workout.routes';
import { createSquadRouter } from './squads.routes';
import { createNutritionRouter } from './nutrition.routes';
import { createAdminRouter } from './admin.routes';

export function createApiRouter(container: Container): Router {
  const router = Router();

  router.use('/auth', createAuthRouter(container.authController));
  router.use('/workouts', createWorkoutRouter(container.workoutController));
  router.use('/squads', createSquadRouter(container.squadController));
  router.use('/nutrition', createNutritionRouter(container.nutritionController));
  router.use('/admin', createAdminRouter());

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return router;
}
