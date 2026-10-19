// Infrastructure HTTP Middleware: authenticate

import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../../domain/services/ITokenService';
import { JwtTokenService } from '../../security/JwtTokenService';

export function createAuthenticateMiddleware(tokenService: ITokenService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'No autorizado',
        message: 'Encabezado de autorizacion Bearer ausente o invalido'
      });
      return;
    }

    const token = authHeader.substring(7).trim();

    try {
      const payload = tokenService.verifyAccessToken(token);
      req.auth = {
        userId: payload.userId,
        role: payload.role
      };
      next();
    } catch {
      res.status(401).json({
        error: 'No autorizado',
        message: 'Token de acceso invalido o expirado'
      });
      return;
    }
  };
}

export const authenticate = createAuthenticateMiddleware(new JwtTokenService());
