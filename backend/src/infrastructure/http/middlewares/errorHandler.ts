// Infrastructure HTTP Middleware: errorHandler

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../domain/errors/DomainError';
import { env } from '../../config/env';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      ...( 'details' in err && err.details ? { details: err.details } : {} )
    });
    return;
  }

  // Error de sintaxis JSON en el cuerpo del request
  if (err instanceof SyntaxError && 'status' in err && (err as { status: unknown }).status === 400) {
    res.status(400).json({
      error: 'JSON Invalido',
      message: 'El cuerpo de la solicitud no contiene un JSON valido'
    });
    return;
  }

  // Error no controlado 500
  const isProd = env.NODE_ENV === 'production';
  const errorMessage = err instanceof Error ? err.message : 'Error interno inesperado en el servidor';
  const stack = err instanceof Error && !isProd ? err.stack : undefined;

  res.status(500).json({
    error: 'Error interno del servidor',
    message: isProd ? 'Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.' : errorMessage,
    ...(stack ? { stack } : {})
  });
}
