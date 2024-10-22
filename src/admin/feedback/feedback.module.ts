import { Module } from '@nestjs/common';
import { FeedbackService } from './services/feedback.service';
import { FeedbackController } from './controllers/feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommendation } from './entities/recommendation.entity';
import { Feedback, Reply } from './entities/feedback.entity';
import { RecommendationController } from './controllers/recommendatioin.controller';
import { RecommendationService } from './services/recommendation.service';
import { RecommendationRepository } from './repositories/recommendation.repository';
import {
  FeedbackRepository,
  ReplyRepository,
} from './repositories/feedback.repository';
import { ContactRepository } from './repositories/contact.repository';
import { ContactService } from './services/contact.service';
import { ContactController } from './controllers/contact.controller';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recommendation, Feedback, Reply, Contact]),
  ],
  controllers: [
    RecommendationController,
    FeedbackController,
    ContactController,
  ],
  providers: [
    RecommendationRepository,
    RecommendationService,
    ReplyRepository,
    FeedbackRepository,
    FeedbackService,
    ContactRepository,
    ContactService,
  ],
})
export class FeedbackModule {}
