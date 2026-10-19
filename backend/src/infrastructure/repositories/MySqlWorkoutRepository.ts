// Infrastructure Repository: MySqlWorkoutRepository

import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import {
  IWorkoutRepository,
  LogSetInput,
  StartSessionInput
} from '../../domain/repositories/IWorkoutRepository';
import { WorkoutSession, SessionStatus } from '../../domain/entities/WorkoutSession';
import { SetLog, LogSetResult, PreviousSessionSummary, isFeeling } from '../../domain/entities/SetLog';

interface WorkoutSessionRow extends RowDataPacket {
  id: number;
  user_id: number;
  routine_id: number | null;
  started_at: Date;
  ended_at: Date | null;
  notes: string | null;
  status: SessionStatus;
  created_at: Date;
  updated_at: Date;
}

interface SetLogRowDataPacket extends RowDataPacket {
  id: number;
  session_id: number;
  user_id: number;
  exercise_id: number;
  set_number: number;
  weight_kg: string | number;
  reps: number;
  rir: number | null;
  rpe: string | number | null;
  feeling: string | null;
  rest_seconds: number | null;
  is_personal_record: number | boolean;
  logged_at: Date;
  created_at: Date;
  updated_at: Date;
}

interface PreviousSessionRowDataPacket extends RowDataPacket {
  previous_session_id: number | null;
  previous_session_date: string | null;
  max_weight_kg: string | number | null;
  reps_at_max_weight: number | null;
}

export class MySqlWorkoutRepository implements IWorkoutRepository {
  constructor(private readonly pool: Pool) {}

  public async startSession(input: StartSessionInput): Promise<WorkoutSession> {
    const sql = `
      INSERT INTO workout_sessions (user_id, routine_id, notes, status, started_at)
      VALUES (?, ?, ?, 'active', NOW(3));
    `;
    const [result] = await this.pool.query<ResultSetHeader>(sql, [
      input.userId,
      input.routineId ?? null,
      input.notes ?? null
    ]);

    const session = await this.findSessionById(result.insertId);
    if (!session) {
      throw new Error('Error al inicializar sesion de entrenamiento');
    }
    return session;
  }

  public async findSessionById(sessionId: number): Promise<WorkoutSession | null> {
    const sql = `SELECT * FROM workout_sessions WHERE id = ? LIMIT 1;`;
    const [rows] = await this.pool.query<WorkoutSessionRow[]>(sql, [sessionId]);
    const row = rows[0];
    if (!row) return null;
    return this.mapRowToSession(row);
  }

  public async findActiveSessionByUserId(userId: number): Promise<WorkoutSession | null> {
    const sql = `
      SELECT * FROM workout_sessions 
      WHERE user_id = ? AND status = 'active'
      ORDER BY started_at DESC
      LIMIT 1;
    `;
    const [rows] = await this.pool.query<WorkoutSessionRow[]>(sql, [userId]);
    const row = rows[0];
    if (!row) return null;
    return this.mapRowToSession(row);
  }

  public async finishSession(sessionId: number, notes?: string | null): Promise<WorkoutSession> {
    const sql = `
      UPDATE workout_sessions
      SET status = 'finished',
          ended_at = NOW(3),
          notes = COALESCE(?, notes)
      WHERE id = ?;
    `;
    await this.pool.query(sql, [notes ?? null, sessionId]);

    const finished = await this.findSessionById(sessionId);
    if (!finished) {
      throw new Error('Error al recuperar sesion finalizada');
    }
    return finished;
  }

  public async logSet(input: LogSetInput): Promise<LogSetResult> {
    const sql = `CALL sp_log_exercise_set(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = [
      input.userId,
      input.sessionId,
      input.exerciseId,
      input.setNumber,
      input.weightKg,
      input.reps,
      input.rir ?? null,
      input.rpe ?? null,
      input.feeling ?? null,
      input.restSeconds ?? null
    ];

    const [results] = await this.pool.query<RowDataPacket[][]>(sql, params);

    const firstResultSet = results[0];
    const secondResultSet = results[1];

    if (!Array.isArray(firstResultSet) || firstResultSet.length === 0) {
      throw new Error('sp_log_exercise_set no retorno los datos de la serie insertada');
    }

    const setRow = firstResultSet[0] as unknown as SetLogRowDataPacket;
    const feeling = isFeeling(setRow.feeling) ? setRow.feeling : null;

    const set = new SetLog({
      id: setRow.id,
      sessionId: setRow.session_id,
      userId: setRow.user_id,
      exerciseId: setRow.exercise_id,
      setNumber: setRow.set_number,
      weightKg: Number(setRow.weight_kg),
      reps: setRow.reps,
      rir: setRow.rir !== null ? Number(setRow.rir) : null,
      rpe: setRow.rpe !== null ? Number(setRow.rpe) : null,
      feeling,
      restSeconds: setRow.rest_seconds !== null ? Number(setRow.rest_seconds) : null,
      isPersonalRecord: Boolean(setRow.is_personal_record),
      loggedAt: setRow.logged_at,
      createdAt: setRow.created_at,
      updatedAt: setRow.updated_at
    });

    let previousSession: PreviousSessionSummary | null = null;
    if (Array.isArray(secondResultSet) && secondResultSet.length > 0) {
      const prevRow = secondResultSet[0] as unknown as PreviousSessionRowDataPacket;
      if (prevRow.previous_session_id !== null && prevRow.previous_session_id !== undefined) {
        previousSession = {
          previousSessionId: Number(prevRow.previous_session_id),
          previousSessionDate: prevRow.previous_session_date ? String(prevRow.previous_session_date) : null,
          maxWeightKg: prevRow.max_weight_kg !== null ? Number(prevRow.max_weight_kg) : null,
          repsAtMaxWeight: prevRow.reps_at_max_weight !== null ? Number(prevRow.reps_at_max_weight) : null
        };
      }
    }

    return {
      set,
      previousSession
    };
  }

  public async getSetsBySession(sessionId: number): Promise<SetLog[]> {
    const sql = `
      SELECT * FROM set_logs
      WHERE session_id = ?
      ORDER BY exercise_id ASC, set_number ASC;
    `;
    const [rows] = await this.pool.query<SetLogRowDataPacket[]>(sql, [sessionId]);
    return rows.map((row) => {
      const feeling = isFeeling(row.feeling) ? row.feeling : null;
      return new SetLog({
        id: row.id,
        sessionId: row.session_id,
        userId: row.user_id,
        exerciseId: row.exercise_id,
        setNumber: row.set_number,
        weightKg: Number(row.weight_kg),
        reps: row.reps,
        rir: row.rir !== null ? Number(row.rir) : null,
        rpe: row.rpe !== null ? Number(row.rpe) : null,
        feeling,
        restSeconds: row.rest_seconds !== null ? Number(row.rest_seconds) : null,
        isPersonalRecord: Boolean(row.is_personal_record),
        loggedAt: row.logged_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    });
  }

  private mapRowToSession(row: WorkoutSessionRow): WorkoutSession {
    return new WorkoutSession({
      id: row.id,
      userId: row.user_id,
      routineId: row.routine_id,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      notes: row.notes,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }
}
