// Application Use Case: ProvisionStudent (Coach provisions athlete)

import { randomBytes } from 'node:crypto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ISquadRepository } from '../../../domain/repositories/ISquadRepository';
import { IPasswordHasher } from '../../../domain/services/IPasswordHasher';
import { IEmailService } from '../../../domain/services/IEmailService';
import { NotFoundError, ForbiddenError, ConflictError } from '../../../domain/errors/DomainError';
import { ROLES } from '../../../domain/value-objects/Role';
import { ProvisionStudentInput } from '../../validators/squad.schemas';
import { ProvisionResultDTO } from '../../dto/auth.dto';

export class ProvisionStudent {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly squadRepository: ISquadRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly emailService: IEmailService,
    private readonly appUrl: string
  ) {}

  public async execute(coachId: number, input: ProvisionStudentInput): Promise<ProvisionResultDTO> {
    const squad = await this.squadRepository.findById(input.squadId);
    if (!squad) {
      throw new NotFoundError('El squad especificado no existe');
    }

    if (!squad.isOwnedBy(coachId)) {
      throw new ForbiddenError('Solo el entrenador propietario del squad puede aprovisionar alumnos');
    }

    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Ya existe un usuario registrado con este correo electronico');
    }

    const roleId = await this.userRepository.findRoleIdByName(ROLES.GYMRAT);
    if (!roleId) {
      throw new NotFoundError('El rol gymrat no esta configurado en la base de datos');
    }

    // Generar contraseña temporal segura de al menos 16 caracteres
    const rawRandom = randomBytes(16).toString('base64').slice(0, 16);
    const temporaryPassword = `Tmp!${rawRandom}9`; // Garantiza mayúscula, minúscula, símbolo y número

    const passwordHash = await this.passwordHasher.hash(temporaryPassword);
    const birthDate = new Date(input.birthDate);

    const studentUser = await this.userRepository.create(
      {
        roleId,
        email: input.email.toLowerCase().trim(),
        passwordHash,
        isActive: true,
        mustChangePassword: true,
        createdByUserId: coachId,
        emailVerifiedAt: new Date()
      },
      {
        userId: 0,
        firstName: input.firstName,
        lastName: input.lastName,
        birthDate
      }
    );

    // Asociar al estudiante al squad
    await this.squadRepository.addMember(squad.id, studentUser.id);

    try {
      await this.emailService.sendStudentWelcomeEmail(
        studentUser.email,
        temporaryPassword,
        squad.name,
        this.appUrl
      );
    } catch {
      // Registrar log silencioso sin interrumpir la creación
    }

    return {
      user: {
        id: studentUser.id,
        email: studentUser.email,
        role: studentUser.role,
        mustChangePassword: studentUser.mustChangePassword,
        firstName: input.firstName,
        lastName: input.lastName,
        avatarUrl: null
      },
      temporaryPassword,
      squadId: squad.id
    };
  }
}
