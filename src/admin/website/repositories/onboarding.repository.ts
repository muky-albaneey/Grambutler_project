import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminOnboarding, Question } from '../entities/onboarding.entity';
import { EntityRepository } from 'src/utils/entity.repository';

export class OnboardingRepository extends EntityRepository<AdminOnboarding> {
  constructor(
    @InjectRepository(AdminOnboarding)
    readonly onboardingModel: Repository<AdminOnboarding>,
  ) {
    super(onboardingModel);
  }

  async saveOnboarding(onboarding: AdminOnboarding): Promise<AdminOnboarding> {
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
