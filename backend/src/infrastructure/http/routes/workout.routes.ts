// Infrastructure HTTP Routes: workout.routes.ts

import { Router } from 'express';
import { WorkoutController } from '../controllers/WorkoutController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validateBody } from '../middlewares/validateBody';
import { ROLES } from '../../../domain/value-objects/Role';
import {
  startSessionSchema,
  logSetSchema,
  finishSessionSchema
} from '../../../application/validators/workout.schemas';

export function createWorkoutRouter(controller: WorkoutController): Router {
  const router = Router();

  // Requiere autenticación y rol de usuario con acceso a workouts
  router.use(authenticate, authorize(ROLES.GYMRAT, ROLES.COACH, ROLES.ADMIN));

  router.post('/start', validateBody(startSessionSchema), controller.startSession);
  router.get('/active', controller.getActiveSession);
  router.post('/set', validateBody(logSetSchema), controller.logSet);
  router.patch('/:id/finish', validateBody(finishSessionSchema), controller.finishSession);

  return router;
}
