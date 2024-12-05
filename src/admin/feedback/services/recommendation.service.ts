import { Injectable } from '@nestjs/common';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '../dto/recommendation.dto';
import { Recommendation } from '../entities/recommendation.entity';
import { FilterDto } from 'src/utils/filter.dto';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly recommendationRepository: RecommendationRepository,
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
}
