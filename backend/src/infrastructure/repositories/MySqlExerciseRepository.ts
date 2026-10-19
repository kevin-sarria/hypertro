// Infrastructure Repository: MySqlExerciseRepository

import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { IExerciseRepository, CreateExerciseData } from '../../domain/repositories/IExerciseRepository';
import { Exercise } from '../../domain/entities/Exercise';

interface ExerciseRow extends RowDataPacket {
  id: number;
  name: string;
  muscle_group_id: number;
  muscle_group_name?: string;
  machine_type_id: number | null;
  machine_type_name?: string | null;
  is_active: number;
  created_by_user_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export class MySqlExerciseRepository implements IExerciseRepository {
  constructor(private readonly pool: Pool) {}

  public async findById(id: number): Promise<Exercise | null> {
    const sql = `
      SELECT e.*, mg.name AS muscle_group_name, mt.name AS machine_type_name
      FROM exercises e
      INNER JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      LEFT JOIN machine_types mt ON e.machine_type_id = mt.id
      WHERE e.id = ?
      LIMIT 1;
    `;
    const [rows] = await this.pool.query<ExerciseRow[]>(sql, [id]);
    const row = rows[0];
    if (!row) return null;
    return this.mapRowToExercise(row);
  }

  public async findAll(): Promise<Exercise[]> {
    const sql = `
      SELECT e.*, mg.name AS muscle_group_name, mt.name AS machine_type_name
      FROM exercises e
      INNER JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      LEFT JOIN machine_types mt ON e.machine_type_id = mt.id
      WHERE e.is_active = 1
      ORDER BY mg.name ASC, e.name ASC;
    `;
    const [rows] = await this.pool.query<ExerciseRow[]>(sql);
    return rows.map((r) => this.mapRowToExercise(r));
  }

  public async findByMuscleGroup(muscleGroupId: number): Promise<Exercise[]> {
    const sql = `
      SELECT e.*, mg.name AS muscle_group_name, mt.name AS machine_type_name
      FROM exercises e
      INNER JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      LEFT JOIN machine_types mt ON e.machine_type_id = mt.id
      WHERE e.muscle_group_id = ? AND e.is_active = 1
      ORDER BY e.name ASC;
    `;
    const [rows] = await this.pool.query<ExerciseRow[]>(sql, [muscleGroupId]);
    return rows.map((r) => this.mapRowToExercise(r));
  }

  public async create(data: CreateExerciseData): Promise<Exercise> {
    const sql = `
      INSERT INTO exercises (name, muscle_group_id, machine_type_id, created_by_user_id)
      VALUES (?, ?, ?, ?);
    `;
    const [result] = await this.pool.query<ResultSetHeader>(sql, [
      data.name,
      data.muscleGroupId,
      data.machineTypeId ?? null,
      data.createdByUserId ?? null
    ]);

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error('Error al recuperar ejercicio recien creado');
    }
    return created;
  }

  private mapRowToExercise(row: ExerciseRow): Exercise {
    return new Exercise({
      id: row.id,
      name: row.name,
      muscleGroupId: row.muscle_group_id,
      muscleGroupName: row.muscle_group_name,
      machineTypeId: row.machine_type_id,
      machineTypeName: row.machine_type_name,
      isActive: Boolean(row.is_active),
      createdByUserId: row.created_by_user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}
