import { Module } from '@nestjs/common';
import {
  LandingPageController,
  LegalController,
  OnboardingController,
} from './controllers';
import {
  PageImageRepository,
  PlanRepository,
  LegalRepository,
  OnboardingRepository,
} from './repositories';
import {
  LandingPageService,
  LegalService,
  OnboardingService,
} from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageImage, Plans } from './entities/landingPage.entity';
import { Legal } from './entities/legal.entity';
import { Onboarding, Question } from './entities/onboarding.entity';
import { QuestionRepository } from './repositories/onboarding.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PageImage, Plans, Legal, Question, Onboarding]),
  ],
  controllers: [LandingPageController, LegalController, OnboardingController],
  providers: [
    PageImageRepository,
    PlanRepository,
    LegalRepository,
    QuestionRepository,
    OnboardingRepository,
    LandingPageService,
    LegalService,
    OnboardingService,
  ],
})
export class WebsiteModule {}
