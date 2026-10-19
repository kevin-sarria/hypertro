// Application Use Case: CreateSquad

import { ISquadRepository } from '../../../domain/repositories/ISquadRepository';
import { CreateSquadInput } from '../../validators/squad.schemas';
import { SquadDTO } from '../../dto/squad.dto';

export class CreateSquad {
  constructor(private readonly squadRepository: ISquadRepository) {}

  public async execute(coachId: number, input: CreateSquadInput): Promise<SquadDTO> {
    const squad = await this.squadRepository.create({
      coachId,
      name: input.name,
      description: input.description ?? null
    });

    return {
      id: squad.id,
      coachId: squad.coachId,
      name: squad.name,
      description: squad.description,
      createdAt: squad.createdAt,
      updatedAt: squad.updatedAt,
      members: []
    };
  }
}
