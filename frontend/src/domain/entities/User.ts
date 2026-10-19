// Frontend Domain Entity: User

export type UserRole = 'gymrat' | 'coach' | 'admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}
