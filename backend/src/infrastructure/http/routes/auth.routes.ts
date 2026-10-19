// Infrastructure HTTP Routes: auth.routes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../middlewares/validateBody';
import { authenticate } from '../middlewares/authenticate';
import { authRateLimiter } from '../middlewares/rateLimiter';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  googleLoginSchema
} from '../../../application/validators/auth.schemas';

export function createAuthRouter(controller: AuthController): Router {
  const router = Router();

  router.post('/register', authRateLimiter, validateBody(registerSchema), controller.register);
  router.post('/login', authRateLimiter, validateBody(loginSchema), controller.login);
  router.post('/refresh', controller.refresh);
  router.post('/logout', authenticate, controller.logout);
  router.post('/google', authRateLimiter, validateBody(googleLoginSchema), controller.googleLogin);
  router.post('/forgot-password', authRateLimiter, validateBody(forgotPasswordSchema), controller.forgotPassword);
  router.post('/reset-password', authRateLimiter, validateBody(resetPasswordSchema), controller.resetPassword);
  router.post('/change-password', authenticate, validateBody(changePasswordSchema), controller.changePassword);

  return router;
}
