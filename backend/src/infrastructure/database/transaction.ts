// Infrastructure Database: Transaction Helper

import { PoolConnection } from 'mysql2/promise';
import { pool } from './pool';

export async function withTransaction<T>(
  action: (connection: PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await action(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
