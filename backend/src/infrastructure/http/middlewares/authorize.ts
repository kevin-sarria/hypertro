// Infrastructure HTTP Middleware: authorize (RBAC Guard)

import { Request, Response, NextFunction } from 'express';
import { Role } from '../../../domain/value-objects/Role';

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({
        error: 'No autenticado',
        message: 'Se requiere iniciar sesion para acceder a este recurso'
      });
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({
        error: 'Acceso denegado',
        message: `El rol '${req.auth.role}' no cuenta con los permisos necesarios para realizar esta accion`
      });
      return;
    }

    next();
  };
}

export function requireSelfOrRole(getParamUserId: (req: Request) => number, ...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({
        error: 'No autenticado',
        message: 'Se requiere iniciar sesion'
      });
      return;
    }

    const targetUserId = getParamUserId(req);
    const isSelf = req.auth.userId === targetUserId;
    const hasRole = allowedRoles.includes(req.auth.role);

    if (isSelf || hasRole) {
      next();
      return;
    }

    res.status(403).json({
      error: 'Acceso denegado',
      message: 'Solo el propio usuario o roles autorizados pueden realizar esta accion'
    });
  };
}
