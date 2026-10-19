// Infrastructure HTTP: Express Application Setup

import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '../config/env';
import { generalRateLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { createApiRouter } from './routes';
import { Container } from '../container';

export function createApp(container: Container): Express {
  const app = express();

  // Encabezados de seguridad
  app.use(helmet());

  // CORS con credenciales y origen configurado
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );

  // Parseo de cookies
  app.use(cookieParser());

  // Límite de tamaño en cuerpo JSON
  app.use(express.json({ limit: '100kb' }));

  // Limitador de tasa global para la API
  app.use('/api', generalRateLimiter);

  // Rutas de la API
  app.use('/api', createApiRouter(container));

  // Manejo de errores centralizado
  app.use(errorHandler);

  return app;
}
