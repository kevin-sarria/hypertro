// Infrastructure Repository: MySqlUserRepository

import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { IUserRepository, CreateUserData, CreateProfileData } from '../../domain/repositories/IUserRepository';
import { User, UserProfile, UserSex } from '../../domain/entities/User';
import { Role, isRole } from '../../domain/value-objects/Role';

interface UserRow extends RowDataPacket {
  id: number;
  role_id: number;
  role_name: string;
  email: string;
  password_hash: string | null;
  google_id: string | null;
  is_active: number;
  email_verified_at: Date | null;
  must_change_password: number;
  created_by_user_id: number | null;
  password_reset_token_hash: string | null;
  password_reset_expires_at: Date | null;
  refresh_token_hash: string | null;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: Date | null;
  avatar_url?: string | null;
  sex?: UserSex | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  activity_factor_id?: number | null;
}

interface RoleRow extends RowDataPacket {
  id: number;
  name: string;
}

interface ProfileRow extends RowDataPacket {
  user_id: number;
  first_name: string;
  last_name: string;
  birth_date: Date;
  avatar_url: string | null;
  sex: UserSex | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_factor_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export class MySqlUserRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  public async findById(id: number): Promise<User | null> {
    const sql = `
      SELECT u.*, r.name AS role_name,
             p.first_name, p.last_name, p.birth_date, p.avatar_url, p.sex, p.height_cm, p.weight_kg, p.activity_factor_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = ?
      LIMIT 1;
    `;
    const [rows] = await this.pool.query<UserRow[]>(sql, [id]);
    const row = rows[0];
    if (!row) return null;
    return this.mapRowToUser(row);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const sql = `
      SELECT u.*, r.name AS role_name,
             p.first_name, p.last_name, p.birth_date, p.avatar_url, p.sex, p.height_cm, p.weight_kg, p.activity_factor_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.email = ?
      LIMIT 1;
    `;
    const [rows] = await this.pool.query<UserRow[]>(sql, [email.toLowerCase().trim()]);
    const row = rows[0];
    if (!row) return null;
    return this.mapRowToUser(row);
  }

  public async findByGoogleId(googleId: string): Promise<User | null> {
    const sql = `
      SELECT u.*, r.name AS role_name,
             p.first_name, p.last_name, p.birth_date, p.avatar_url, p.sex, p.height_cm, p.weight_kg, p.activity_factor_id
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE u.google_id = ?
      LIMIT 1;
    `;
    const [rows] = await this.pool.query<UserRow[]>(sql, [googleId]);
    const row = rows[0];
    if (!row) return null;
    return this.mapRowToUser(row);
  }

  public async findByResetTokenHash(tokenHash: string): Promise<User | null> {
    const sql = `
      SELECT u.*, r.name AS role_name
      FROM users u
      INNER JOIN roles r ON u.role_id = r.id
      WHERE u.password_reset_token_hash = ?
      LIMIT 1;
    `;
    const [rows] = await this.pool.query<UserRow[]>(sql, [tokenHash]);
    const row = rows[0];
    if (!row) return null;
    return this.mapRowToUser(row);
  }

  public async create(userData: CreateUserData, profileData?: CreateProfileData): Promise<User> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      const insertUserSql = `
        INSERT INTO users (
          role_id, email, password_hash, google_id, is_active,
          must_change_password, created_by_user_id, email_verified_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;
      const [userResult] = await connection.query<ResultSetHeader>(insertUserSql, [
        userData.roleId,
        userData.email,
        userData.passwordHash,
        userData.googleId ?? null,
        userData.isActive ?? true ? 1 : 0,
        userData.mustChangePassword ?? false ? 1 : 0,
        userData.createdByUserId ?? null,
        userData.emailVerifiedAt ?? null
      ]);

      const userId = userResult.insertId;

      if (profileData) {
        const insertProfileSql = `
          INSERT INTO user_profiles (
            user_id, first_name, last_name, birth_date, avatar_url, sex, height_cm, weight_kg, activity_factor_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await connection.query(insertProfileSql, [
          userId,
          profileData.firstName,
          profileData.lastName,
          profileData.birthDate,
          profileData.avatarUrl ?? null,
          profileData.sex ?? null,
          profileData.heightCm ?? null,
          profileData.weightKg ?? null,
          profileData.activityFactorId ?? null
        ]);
      }

      await connection.commit();

      const created = await this.findById(userId);
      if (!created) {
        throw new Error('Error al recuperar usuario recien insertado');
      }
      return created;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  public async update(
    id: number,
    data: Partial<Pick<User, 'email' | 'isActive' | 'mustChangePassword' | 'emailVerifiedAt' | 'lastLoginAt'>>
  ): Promise<void> {
    const clauses: string[] = [];
    const values: (string | number | Date | null)[] = [];

    if (data.email !== undefined) {
      clauses.push('email = ?');
      values.push(data.email);
    }
    if (data.isActive !== undefined) {
      clauses.push('is_active = ?');
      values.push(data.isActive ? 1 : 0);
    }
    if (data.mustChangePassword !== undefined) {
      clauses.push('must_change_password = ?');
      values.push(data.mustChangePassword ? 1 : 0);
    }
    if (data.emailVerifiedAt !== undefined) {
      clauses.push('email_verified_at = ?');
      values.push(data.emailVerifiedAt);
    }
    if (data.lastLoginAt !== undefined) {
      clauses.push('last_login_at = ?');
      values.push(data.lastLoginAt);
    }

    if (clauses.length === 0) return;

    values.push(id);
    const sql = `UPDATE users SET ${clauses.join(', ')} WHERE id = ?;`;
    await this.pool.query(sql, values);
  }

  public async updatePassword(id: number, passwordHash: string): Promise<void> {
    const sql = `UPDATE users SET password_hash = ? WHERE id = ?;`;
    await this.pool.query(sql, [passwordHash, id]);
  }

  public async updateRefreshTokenHash(id: number, tokenHash: string | null): Promise<void> {
    const sql = `UPDATE users SET refresh_token_hash = ? WHERE id = ?;`;
    await this.pool.query(sql, [tokenHash, id]);
  }

  public async setPasswordResetToken(id: number, tokenHash: string | null, expiresAt: Date | null): Promise<void> {
    const sql = `UPDATE users SET password_reset_token_hash = ?, password_reset_expires_at = ? WHERE id = ?;`;
    await this.pool.query(sql, [tokenHash, expiresAt, id]);
  }

  public async findRoleIdByName(roleName: Role): Promise<number | null> {
    const sql = `SELECT id, name FROM roles WHERE name = ? LIMIT 1;`;
    const [rows] = await this.pool.query<RoleRow[]>(sql, [roleName]);
    const row = rows[0];
    return row ? row.id : null;
  }

  public async getProfile(userId: number): Promise<UserProfile | null> {
    const sql = `SELECT * FROM user_profiles WHERE user_id = ? LIMIT 1;`;
    const [rows] = await this.pool.query<ProfileRow[]>(sql, [userId]);
    const row = rows[0];
    if (!row) return null;
    return {
      userId: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      birthDate: row.birth_date,
      avatarUrl: row.avatar_url,
      sex: row.sex,
      heightCm: row.height_cm !== null ? Number(row.height_cm) : null,
      weightKg: row.weight_kg !== null ? Number(row.weight_kg) : null,
      activityFactorId: row.activity_factor_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  private mapRowToUser(row: UserRow): User {
    const role: Role = isRole(row.role_name) ? row.role_name : 'gymrat';
    let profile: UserProfile | null = null;
    if (row.first_name && row.last_name && row.birth_date) {
      profile = {
        userId: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        birthDate: row.birth_date,
        avatarUrl: row.avatar_url ?? null,
        sex: row.sex ?? null,
        heightCm: row.height_cm !== null && row.height_cm !== undefined ? Number(row.height_cm) : null,
        weightKg: row.weight_kg !== null && row.weight_kg !== undefined ? Number(row.weight_kg) : null,
        activityFactorId: row.activity_factor_id ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    }

    return new User({
      id: row.id,
      roleId: row.role_id,
      role,
      email: row.email,
      passwordHash: row.password_hash,
      googleId: row.google_id,
      isActive: Boolean(row.is_active),
      emailVerifiedAt: row.email_verified_at,
      mustChangePassword: Boolean(row.must_change_password),
      createdByUserId: row.created_by_user_id,
      passwordResetTokenHash: row.password_reset_token_hash,
      passwordResetExpiresAt: row.password_reset_expires_at,
      refreshTokenHash: row.refresh_token_hash,
      lastLoginAt: row.last_login_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      profile
    });
  }
}
