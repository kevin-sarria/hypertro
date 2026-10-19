// Application Use Case: RequestPasswordReset

import { randomBytes, createHash } from 'node:crypto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IEmailService } from '../../../domain/services/IEmailService';
import { ForgotPasswordInput } from '../../validators/auth.schemas';

export interface RequestPasswordResetResult {
  message: string;
}

export class RequestPasswordReset {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService,
    private readonly appUrl: string
  ) {}

  public async execute(input: ForgotPasswordInput): Promise<RequestPasswordResetResult> {
    const genericResponse: RequestPasswordResetResult = {
      message: 'Si el correo esta registrado, recibiras las instrucciones para restablecer tu contrasena en breve.'
    };

    const user = await this.userRepository.findByEmail(input.email);
    if (!user || !user.isActive) {
      // Respuesta genérica para evitar filtración de existencia de emails
      return genericResponse;
    }

    // Generar token aleatorio criptográficamente seguro de 32 bytes
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    await this.userRepository.setPasswordResetToken(user.id, tokenHash, expiresAt);

    try {
      await this.emailService.sendPasswordResetEmail(user.email, rawToken, this.appUrl);
    } catch {
      // Registrar log silencioso sin romper la respuesta genérica
    }

    return genericResponse;
  }
}
