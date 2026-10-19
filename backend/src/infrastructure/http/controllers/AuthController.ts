// Infrastructure HTTP Controller: AuthController

import { Request, Response, NextFunction, CookieOptions } from 'express';
import { RegisterUser } from '../../../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../../../application/use-cases/auth/LoginUser';
import { RefreshSession } from '../../../application/use-cases/auth/RefreshSession';
import { LogoutUser } from '../../../application/use-cases/auth/LogoutUser';
import { GoogleLogin } from '../../../application/use-cases/auth/GoogleLogin';
import { RequestPasswordReset } from '../../../application/use-cases/auth/RequestPasswordReset';
import { ResetPassword } from '../../../application/use-cases/auth/ResetPassword';
import { ChangePassword } from '../../../application/use-cases/auth/ChangePassword';
import { UnauthorizedError } from '../../../domain/errors/DomainError';
import { env } from '../../config/env';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUser,
    private readonly loginUserUseCase: LoginUser,
    private readonly refreshSessionUseCase: RefreshSession,
    private readonly logoutUserUseCase: LogoutUser,
    private readonly googleLoginUseCase: GoogleLogin,
    private readonly requestPasswordResetUseCase: RequestPasswordReset,
    private readonly resetPasswordUseCase: ResetPassword,
    private readonly changePasswordUseCase: ChangePassword
  ) {}

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    };
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.registerUserUseCase.execute(req.body);
      res.cookie('refreshToken', result.tokens.refreshToken, this.getCookieOptions());
      res.status(201).json({
        user: result.user,
        accessToken: result.tokens.accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.loginUserUseCase.execute(req.body);
      res.cookie('refreshToken', result.tokens.refreshToken, this.getCookieOptions());
      res.status(200).json({
        user: result.user,
        accessToken: result.tokens.accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = (req.cookies as Record<string, string | undefined>)['refreshToken'];
      if (!refreshToken) {
        throw new UnauthorizedError('Cookie de refresco ausente');
      }

      const tokens = await this.refreshSessionUseCase.execute(refreshToken);
      res.cookie('refreshToken', tokens.refreshToken, this.getCookieOptions());
      res.status(200).json({
        accessToken: tokens.accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.auth) {
        await this.logoutUserUseCase.execute(req.auth.userId);
      }
      res.clearCookie('refreshToken', { path: '/api/auth' });
      res.status(200).json({ message: 'Sesion cerrada exitosamente' });
    } catch (error) {
      next(error);
    }
  };

  public googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.googleLoginUseCase.execute(req.body);
      res.cookie('refreshToken', result.tokens.refreshToken, this.getCookieOptions());
      res.status(200).json({
        user: result.user,
        accessToken: result.tokens.accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.requestPasswordResetUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.resetPasswordUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new UnauthorizedError();
      }
      const result = await this.changePasswordUseCase.execute(req.auth.userId, req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
