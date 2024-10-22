import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Onboarding, Question } from '../entities/onboarding.entity';
import { EntityRepository } from 'src/utils/entity.repository';

export class OnboardingRepository extends EntityRepository<Onboarding> {
  constructor(
    @InjectRepository(Onboarding)
    readonly onboardingModel: Repository<Onboarding>,
  ) {
    super(onboardingModel);
  }

  async saveOnboarding(onboarding: Onboarding): Promise<Onboarding> {
    return await this.onboardingModel.save(onboarding);
  }
}

export class QuestionRepository extends EntityRepository<Question> {
  constructor(
    @InjectRepository(Question)
    readonly questionModel: Repository<Question>,
  ) {
    super(questionModel);
  }
}
