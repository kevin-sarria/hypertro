// Domain Repository Interface: IUserRepository

import { User, UserProfile, UserSex } from '../entities/User';
import { Role } from '../value-objects/Role';

export interface CreateUserData {
  roleId: number;
  email: string;
  passwordHash: string | null;
  googleId?: string | null;
  isActive?: boolean;
  mustChangePassword?: boolean;
  createdByUserId?: number | null;
  emailVerifiedAt?: Date | null;
}

export interface CreateProfileData {
  userId: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  avatarUrl?: string | null;
  sex?: UserSex | null;
  heightCm?: number | null;
  weightKg?: number | null;
  activityFactorId?: number | null;
}

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByResetTokenHash(tokenHash: string): Promise<User | null>;
  create(userData: CreateUserData, profileData?: CreateProfileData): Promise<User>;
  update(id: number, data: Partial<Pick<User, 'email' | 'isActive' | 'mustChangePassword' | 'emailVerifiedAt' | 'lastLoginAt'>>): Promise<void>;
  updatePassword(id: number, passwordHash: string): Promise<void>;
  updateRefreshTokenHash(id: number, tokenHash: string | null): Promise<void>;
  setPasswordResetToken(id: number, tokenHash: string | null, expiresAt: Date | null): Promise<void>;
  findRoleIdByName(roleName: Role): Promise<number | null>;
  getProfile(userId: number): Promise<UserProfile | null>;
}
