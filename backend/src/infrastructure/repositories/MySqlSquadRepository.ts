// Infrastructure Repository: MySqlSquadRepository

import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { ISquadRepository, CreateSquadData } from '../../domain/repositories/ISquadRepository';
import { Squad, SquadMember } from '../../domain/entities/Squad';

interface SquadRow extends RowDataPacket {
  id: number;
  coach_id: number;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

interface SquadMemberRow extends RowDataPacket {
  squad_id: number;
  user_id: number;
  joined_at: Date;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export class MySqlSquadRepository implements ISquadRepository {
  constructor(private readonly pool: Pool) {}

  public async create(data: CreateSquadData): Promise<Squad> {
    const sql = `
      INSERT INTO squads (coach_id, name, description)
      VALUES (?, ?, ?);
    `;
    const [result] = await this.pool.query<ResultSetHeader>(sql, [
      data.coachId,
      data.name,
      data.description ?? null
    ]);

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error('Error al recuperar squad recien creado');
    }
    return created;
  }

  public async findById(id: number): Promise<Squad | null> {
    const sql = `SELECT * FROM squads WHERE id = ? LIMIT 1;`;
    const [rows] = await this.pool.query<SquadRow[]>(sql, [id]);
    const row = rows[0];
    if (!row) return null;

    const members = await this.getMembers(id);

    return new Squad({
      id: row.id,
      coachId: row.coach_id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      members
    });
  }

  public async findByCoachId(coachId: number): Promise<Squad[]> {
    const sql = `SELECT * FROM squads WHERE coach_id = ? ORDER BY name ASC;`;
    const [rows] = await this.pool.query<SquadRow[]>(sql, [coachId]);
    return rows.map(
      (row) =>
        new Squad({
          id: row.id,
          coachId: row.coach_id,
          name: row.name,
          description: row.description,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        })
    );
  }

  public async addMember(squadId: number, userId: number): Promise<void> {
    const sql = `
      INSERT INTO squad_members (squad_id, user_id, joined_at)
      VALUES (?, ?, NOW(3))
      ON DUPLICATE KEY UPDATE joined_at = joined_at;
    `;
    await this.pool.query(sql, [squadId, userId]);
  }

  public async getMembers(squadId: number): Promise<SquadMember[]> {
    const sql = `
      SELECT sm.squad_id, sm.user_id, sm.joined_at,
             u.email, p.first_name, p.last_name
      FROM squad_members sm
      INNER JOIN users u ON sm.user_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE sm.squad_id = ?
      ORDER BY p.first_name ASC, sm.joined_at DESC;
    `;
    const [rows] = await this.pool.query<SquadMemberRow[]>(sql, [squadId]);
    return rows.map((r) => ({
      squadId: r.squad_id,
      userId: r.user_id,
      joinedAt: r.joined_at,
      email: r.email,
      firstName: r.first_name,
      lastName: r.last_name
    }));
  }

  public async removeMember(squadId: number, userId: number): Promise<void> {
    const sql = `DELETE FROM squad_members WHERE squad_id = ? AND user_id = ?;`;
    await this.pool.query(sql, [squadId, userId]);
  }
}
