import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { authorize } from '../../src/infrastructure/http/middlewares/authorize';
import { ROLES } from '../../src/domain/value-objects/Role';

describe('authorize middleware (RBAC guard)', () => {
  it('debe responder 401 si req.auth no existe', () => {
    const middleware = authorize(ROLES.COACH, ROLES.ADMIN);
    const req = {} as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'No autenticado' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('debe responder 403 si el rol del usuario no está en la lista permitida', () => {
    const middleware = authorize(ROLES.COACH, ROLES.ADMIN);
    const req = {
      auth: { userId: 1, role: ROLES.GYMRAT }
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Acceso denegado' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('debe invocar next() si el rol está permitido', () => {
    const middleware = authorize(ROLES.COACH, ROLES.ADMIN);
    const req = {
      auth: { userId: 2, role: ROLES.COACH }
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
