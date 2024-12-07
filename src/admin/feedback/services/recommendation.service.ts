import { Injectable } from '@nestjs/common';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '../dto/recommendation.dto';
import { Recommendation } from '../entities/recommendation.entity';
import { FilterDto, PeriodEnum } from 'src/utils/filter.dto';
import { MoreThanOrEqual } from 'typeorm';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { getStartDate } from 'src/utils/date.helper';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly recommendationRepository: RecommendationRepository,
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  create(
    createRecommendationDto: CreateRecommendationDto,
  ): Promise<Recommendation> {
    return this.recommendationRepository.create(createRecommendationDto);
  }

  findAll(filter: FilterDto): Promise<Recommendation[]> {
    return this.recommendationRepository.find({}, { ...filter });
  }

  findOne(id: string): Promise<Recommendation> {
    return this.recommendationRepository.findOne({ id }, null, {
      feedbacks: true,
    });
  }

  update(
    id: string,
    updateRecommendationDto: UpdateRecommendationDto,
  ): Promise<Recommendation> {
    return this.recommendationRepository.findOneAndUpdate(
      { id },
      updateRecommendationDto,
    );
  }

  remove(id: string): Promise<boolean> {
    return this.recommendationRepository.deleteMany({ id });
  }

  async calculateFeedbackPercentage(period: PeriodEnum) {
    const now = new Date();
    const startDate: Date = getStartDate(now, period);

    // Total Recommendations
    const totalRecommendations = await this.recommendationRepository.find({});

    const feedbacks = await this.feedbackRepository.find(
      {
        createdAt: MoreThanOrEqual(startDate),
      },
      { projection: ['recommendation'], populate: ['recommendation'] },
    );

    const uniqueRecommendationsWithFeedback = new Set(
      feedbacks.map((feedback) => feedback.recommendation.id),
    ).size;

    const percentage =
      totalRecommendations.length === 0
        ? 0
        : (
            (uniqueRecommendationsWithFeedback / totalRecommendations.length) *
            100
          ).toFixed(2);

    return {
      period,
      totalRecommendations,
      recommendationsWithFeedback: uniqueRecommendationsWithFeedback,
      percentage: percentage,
    };
  }
}
