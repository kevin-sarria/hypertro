import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { createAuthenticateMiddleware } from '../../src/infrastructure/http/middlewares/authenticate';
import { ITokenService } from '../../src/domain/services/ITokenService';
import { UnauthorizedError } from '../../src/domain/errors/DomainError';

describe('authenticate middleware', () => {
  const mockTokenService: ITokenService = {
    signAccessToken: vi.fn(),
    signRefreshToken: vi.fn(),
    verifyAccessToken: vi.fn(),
    verifyRefreshToken: vi.fn()
  };

  const middleware = createAuthenticateMiddleware(mockTokenService);

  it('debe responder 401 si no se envía encabezado de autorización', () => {
    const req = { headers: {} } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'No autorizado' })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('debe responder 401 si el token es inválido o ha expirado', () => {
    vi.mocked(mockTokenService.verifyAccessToken).mockImplementationOnce(() => {
      throw new UnauthorizedError('Token expirado');
    });

    const req = {
      headers: { authorization: 'Bearer token-invalido' }
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('debe adjuntar req.auth y llamar a next() si el token es válido', () => {
    vi.mocked(mockTokenService.verifyAccessToken).mockReturnValueOnce({
      userId: 42,
      role: 'gymrat'
    });

    const req = {
      headers: { authorization: 'Bearer token-valido' }
    } as unknown as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn();

    middleware(req, res, next);

    expect(req.auth).toEqual({ userId: 42, role: 'gymrat' });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
