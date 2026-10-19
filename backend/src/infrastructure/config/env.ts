// Infrastructure Config: Zod-validated environment variables

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // MySQL Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('3306').transform((val) => parseInt(val, 10)),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('hypertro_db'),
  DB_POOL_LIMIT: z.string().default('10').transform((val) => parseInt(val, 10)),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ISSUER: z.string().default('hypertro-auth'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional().default(''),

  // SMTP
  SMTP_HOST: z.string().optional().default('localhost'),
  SMTP_PORT: z.string().default('587').transform((val) => parseInt(val, 10)),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  MAIL_FROM: z.string().default('Hypertro <no-reply@hypertro.app>'),

  // App URL
  APP_URL: z.string().default('http://localhost:5173')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error('Configuracion de variables de entorno invalida:', parsedEnv.error.format());
  throw new Error('Configuracion de entorno invalida. Revise su archivo .env');
}

export const env = parsedEnv.data;
