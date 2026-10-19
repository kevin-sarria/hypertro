// Domain Entity: User and UserProfile

import { Role } from '../value-objects/Role';

export type UserSex = 'male' | 'female' | 'other';

export interface UserProfile {
  readonly userId: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  avatarUrl: string | null;
  sex: UserSex | null;
  heightCm: number | null;
  weightKg: number | null;
  activityFactorId: number | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface UserProps {
  id: number;
  roleId: number;
  role: Role;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  mustChangePassword: boolean;
  createdByUserId: number | null;
  passwordResetTokenHash: string | null;
  passwordResetExpiresAt: Date | null;
  refreshTokenHash: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profile?: UserProfile | null;
}

export class User {
  constructor(private readonly props: UserProps) {}

  public get id(): number {
    return this.props.id;
  }

  public get roleId(): number {
    return this.props.roleId;
  }

  public get role(): Role {
    return this.props.role;
  }

  public get email(): string {
    return this.props.email;
  }

  public get passwordHash(): string | null {
    return this.props.passwordHash;
  }

  public get googleId(): string | null {
    return this.props.googleId;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public get emailVerifiedAt(): Date | null {
    return this.props.emailVerifiedAt;
  }

  public get mustChangePassword(): boolean {
    return this.props.mustChangePassword;
  }

  public get createdByUserId(): number | null {
    return this.props.createdByUserId;
  }

  public get passwordResetTokenHash(): string | null {
    return this.props.passwordResetTokenHash;
  }

  public get passwordResetExpiresAt(): Date | null {
    return this.props.passwordResetExpiresAt;
  }

  public get refreshTokenHash(): string | null {
    return this.props.refreshTokenHash;
  }

  public get lastLoginAt(): Date | null {
    return this.props.lastLoginAt;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get profile(): UserProfile | null {
    return this.props.profile ?? null;
  }

  public isCoach(): boolean {
    return this.props.role === 'coach';
  }

  public isAdmin(): boolean {
    return this.props.role === 'admin';
  }

  public canManageSquad(): boolean {
    return this.isCoach() || this.isAdmin();
  }
}
