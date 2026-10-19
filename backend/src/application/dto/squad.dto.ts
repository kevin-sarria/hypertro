// Application DTO: Squad

import { SquadMember } from '../../domain/entities/Squad';

export interface SquadDTO {
  id: number;
  coachId: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  members?: SquadMember[];
}
