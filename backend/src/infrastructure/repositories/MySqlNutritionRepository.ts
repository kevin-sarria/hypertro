// Infrastructure Repository: MySqlNutritionRepository

import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import {
  INutritionRepository,
  CreateNutritionLogData,
  DailyNutritionSummary
} from '../../domain/repositories/INutritionRepository';
import { NutritionLog } from '../../domain/entities/NutritionLog';

interface NutritionLogRow extends RowDataPacket {
  id: number;
  user_id: number;
  log_date: string;
  meal_name: string;
  calories: number;
  protein_g: string | number;
  carbs_g: string | number;
  fat_g: string | number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

interface NutritionSummaryRow extends RowDataPacket {
  log_date: string;
  total_calories: number | null;
  total_protein: string | number | null;
  total_carbs: string | number | null;
  total_fat: string | number | null;
  meal_count: number;
}

export class MySqlNutritionRepository implements INutritionRepository {
  constructor(private readonly pool: Pool) {}

  public async create(data: CreateNutritionLogData): Promise<NutritionLog> {
    const sql = `
      INSERT INTO nutrition_logs (user_id, log_date, meal_name, calories, protein_g, carbs_g, fat_g, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [result] = await this.pool.query<ResultSetHeader>(sql, [
      data.userId,
      data.logDate,
      data.mealName,
      data.calories,
      data.proteinG,
      data.carbsG,
      data.fatG,
      data.notes ?? null
    ]);

    const selectSql = `SELECT * FROM nutrition_logs WHERE id = ? LIMIT 1;`;
    const [rows] = await this.pool.query<NutritionLogRow[]>(selectSql, [result.insertId]);
    const row = rows[0];
    if (!row) {
      throw new Error('Error al recuperar registro de nutricion recien creado');
    }

    return this.mapRowToNutritionLog(row);
  }

  public async findByUserIdAndDate(userId: number, logDate: string): Promise<NutritionLog[]> {
    const sql = `
      SELECT * FROM nutrition_logs
      WHERE user_id = ? AND log_date = ?
      ORDER BY created_at ASC;
    `;
    const [rows] = await this.pool.query<NutritionLogRow[]>(sql, [userId, logDate]);
    return rows.map((r) => this.mapRowToNutritionLog(r));
  }

  public async getDailySummary(userId: number, logDate: string): Promise<DailyNutritionSummary> {
    const sql = `
      SELECT 
        log_date,
        SUM(calories) AS total_calories,
        SUM(protein_g) AS total_protein,
        SUM(carbs_g) AS total_carbs,
        SUM(fat_g) AS total_fat,
        COUNT(id) AS meal_count
      FROM nutrition_logs
      WHERE user_id = ? AND log_date = ?
      GROUP BY log_date;
    `;
    const [rows] = await this.pool.query<NutritionSummaryRow[]>(sql, [userId, logDate]);
    const row = rows[0];
    if (!row) {
      return {
        logDate,
        totalCalories: 0,
        totalProteinG: 0,
        totalCarbsG: 0,
        totalFatG: 0,
        mealCount: 0
      };
    }

    return {
      logDate: row.log_date,
      totalCalories: Number(row.total_calories ?? 0),
      totalProteinG: Number(row.total_protein ?? 0),
      totalCarbsG: Number(row.total_carbs ?? 0),
      totalFatG: Number(row.total_fat ?? 0),
      mealCount: Number(row.meal_count)
    };
  }

  private mapRowToNutritionLog(row: NutritionLogRow): NutritionLog {
    return new NutritionLog({
      id: row.id,
      userId: row.user_id,
      logDate: row.log_date,
      mealName: row.meal_name,
      calories: row.calories,
      proteinG: Number(row.protein_g),
      carbsG: Number(row.carbs_g),
      fatG: Number(row.fat_g),
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}
