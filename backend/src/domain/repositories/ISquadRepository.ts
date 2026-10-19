// Domain Repository Interface: ISquadRepository

import { Squad, SquadMember } from '../entities/Squad';

export interface CreateSquadData {
  coachId: number;
  name: string;
  description?: string | null;
}

export interface ISquadRepository {
  create(data: CreateSquadData): Promise<Squad>;
  findById(id: number): Promise<Squad | null>;
  findByCoachId(coachId: number): Promise<Squad[]>;
  addMember(squadId: number, userId: number): Promise<void>;
  getMembers(squadId: number): Promise<SquadMember[]>;
  removeMember(squadId: number, userId: number): Promise<void>;
}
