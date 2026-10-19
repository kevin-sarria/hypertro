// Infrastructure HTTP Middleware: validateBody

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const error: ZodError = parseResult.error;
      const formattedErrors: Record<string, string[]> = {};

      for (const issue of error.issues) {
        const path = issue.path.join('.') || 'body';
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path]?.push(issue.message);
      }

      res.status(400).json({
        error: 'Error de validacion',
        message: 'Los datos enviados en la solicitud no cumplen con el formato requerido',
        details: formattedErrors
      });
      return;
    }

    req.body = parseResult.data;
    next();
  };
}
