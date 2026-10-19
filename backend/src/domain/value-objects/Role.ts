// Domain Value Object: Role

export const ROLES = {
  GYMRAT: 'gymrat',
  COACH: 'coach',
  ADMIN: 'admin'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: readonly Role[] = [ROLES.GYMRAT, ROLES.COACH, ROLES.ADMIN] as const;

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ALL_ROLES as readonly string[]).includes(value);
}

export function assertRole(value: unknown): asserts value is Role {
  if (!isRole(value)) {
    throw new Error(`Rol invalido: ${String(value)}`);
  }
}
