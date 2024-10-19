import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from 'src/utils/entity.repository';
import { PageImage, Plans } from '../entities/landingPage.entity';

export class PlanRepository extends EntityRepository<Plans> {
  constructor(
    @InjectRepository(Plans)
    readonly plansModel: Repository<Plans>,
  ) {
    super(plansModel);
  }
}

export class PageImageRepository extends EntityRepository<PageImage> {
  constructor(
    @InjectRepository(PageImage)
    readonly pageImageModel: Repository<PageImage>,
  ) {
    super(pageImageModel);
  }
}
