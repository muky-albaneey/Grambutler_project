import { InjectRepository } from '@nestjs/typeorm';
import { Recommendation } from '../entities/recommendation.entity';
import { EntityRepository } from 'src/utils/entity.repository';
import { Repository } from 'typeorm';

export class RecommendationRepository extends EntityRepository<Recommendation> {
  constructor(
    @InjectRepository(Recommendation)
    readonly recommendationModel: Repository<Recommendation>,
  ) {
    super(recommendationModel);
  }
}
