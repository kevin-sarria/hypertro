// Infrastructure HTTP: Express Request augmentation

import { Role } from '../../../domain/value-objects/Role';

export interface AuthPayload {
  userId: number;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}
