// Infrastructure Services: GoogleOAuthProvider

import { OAuth2Client } from 'google-auth-library';
import { IGoogleAuthProvider, GoogleAuthPayload } from '../../domain/services/IGoogleAuthProvider';
import { UnauthorizedError } from '../../domain/errors/DomainError';
import { env } from '../config/env';

export class GoogleOAuthProvider implements IGoogleAuthProvider {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }

  public async verifyIdToken(idToken: string): Promise<GoogleAuthPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID || undefined
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new UnauthorizedError('Token de Google no contiene informacion de usuario valida');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified ?? false,
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatarUrl: payload.picture
      };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError('Fallo al validar el token con Google OAuth');
    }
  }
}
