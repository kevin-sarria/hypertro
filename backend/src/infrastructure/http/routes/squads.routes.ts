// Infrastructure HTTP Routes: squads.routes.ts

import { Router } from 'express';
import { SquadController } from '../controllers/SquadController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validateBody } from '../middlewares/validateBody';
import { ROLES } from '../../../domain/value-objects/Role';
import {
  createSquadSchema,
  provisionStudentSchema
} from '../../../application/validators/squad.schemas';

export function createSquadRouter(controller: SquadController): Router {
  const router = Router();

  // Exclusivo para coaches y administradores
  router.use(authenticate, authorize(ROLES.COACH, ROLES.ADMIN));

  router.post('/', validateBody(createSquadSchema), controller.create);
  router.get('/mine', controller.getMySquads);
  router.post('/provision', validateBody(provisionStudentSchema), controller.provisionStudent);

  return router;
}
