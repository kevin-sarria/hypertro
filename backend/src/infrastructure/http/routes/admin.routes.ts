// Infrastructure HTTP Routes: admin.routes.ts

import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { ROLES } from '../../../domain/value-objects/Role';
import { pool } from '../../database/pool';
import { RowDataPacket } from 'mysql2/promise';

interface CatalogRow extends RowDataPacket {
  id: number;
  name: string;
}

interface UserSummaryRow extends RowDataPacket {
  totalUsers: number;
  activeUsers: number;
}

export function createAdminRouter(): Router {
  const router = Router();

  // Exclusivo para administradores de la plataforma
  router.use(authenticate, authorize(ROLES.ADMIN));

  router.get('/metrics', async (_req: Request, res: Response) => {
    const [rows] = await pool.query<UserSummaryRow[]>(`
      SELECT 
        COUNT(id) AS totalUsers,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS activeUsers
      FROM users;
    `);

    const summary = rows[0] ?? { totalUsers: 0, activeUsers: 0 };
    res.status(200).json({
      status: 'ok',
      totalUsers: Number(summary.totalUsers),
      activeUsers: Number(summary.activeUsers)
    });
  });

  router.get('/catalogs/muscle-groups', async (_req: Request, res: Response) => {
    const [rows] = await pool.query<CatalogRow[]>('SELECT id, name FROM muscle_groups ORDER BY name ASC;');
    res.status(200).json(rows);
  });

  router.get('/catalogs/machine-types', async (_req: Request, res: Response) => {
    const [rows] = await pool.query<CatalogRow[]>('SELECT id, name FROM machine_types ORDER BY name ASC;');
    res.status(200).json(rows);
  });

  return router;
}
