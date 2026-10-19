// Domain errors and application base errors

export abstract class AppError extends Error {
  public abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  public override readonly statusCode = 400;

  constructor(message: string, public readonly details?: Record<string, string[]>) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  public override readonly statusCode = 401;

  constructor(message = 'No autorizado o credenciales invalidas') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  public override readonly statusCode = 403;

  constructor(message = 'Acceso denegado') {
    super(message);
  }
}

export class NotFoundError extends AppError {
  public override readonly statusCode = 404;

  constructor(message = 'Recurso no encontrado') {
    super(message);
  }
}

export class ConflictError extends AppError {
  public override readonly statusCode = 409;

  constructor(message = 'Conflicto con un recurso existente') {
    super(message);
  }
}
