import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from 'src/utils/entity.repository';
import { Legal } from '../entities/legal.entity';

export class LegalRepository extends EntityRepository<Legal> {
  constructor(
    @InjectRepository(Legal)
    readonly legalModel: Repository<Legal>,
  ) {
    super(legalModel);
  }
}
