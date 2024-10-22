import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateFeedbackDto,
  CreateReplyDto,
  UpdateFeedbackDto,
  UpdateFeedbackStatusDto,
} from '../dto/feedback.dto';
import { Feedback, Reply } from '../entities/feedback.entity';
import {
  FeedbackRepository,
  ReplyRepository,
} from '../repositories/feedback.repository';
import { RecommendationRepository } from '../repositories/recommendation.repository';
import { FilterDto } from 'src/utils/filter.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly replyRepository: ReplyRepository,
    private readonly recommendationRepository: RecommendationRepository,
  ) {}

  async createFeedback(
    createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    const recommendation = await this.recommendationRepository.findOne({
      id: createFeedbackDto.recommendationId,
    });

    if (!recommendation) {
      throw new NotFoundException('Recommendation not found');
    }

    return await this.feedbackRepository.create({
      feedbackText: createFeedbackDto.feedbackText,
      recommendation,
    });
  }

  async createReply(
    feedbackId: string,
    createReplyDto: CreateReplyDto,
  ): Promise<Reply> {
    const feedback = await this.feedbackRepository.findOne({
      id: feedbackId,
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    return await this.replyRepository.create({
      comment: createReplyDto.comment,
      feedback,
    });
  }

  async findAll(filter: FilterDto): Promise<Feedback[]> {
    return await this.feedbackRepository.find({}, { ...filter });
  }

  async findOne(id: string): Promise<Feedback> {
    return await this.feedbackRepository.findOne({ id }, null, {
      replies: true,
    });
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return await this.feedbackRepository.findOneAndUpdate(
      { id },
      updateFeedbackDto,
    );
  }

  async updateFeedbackStatus(
    id: string,
    updateFeedbackStatusDto: UpdateFeedbackStatusDto,
  ): Promise<Feedback> {
    return await this.feedbackRepository.findOneAndUpdate(
      { id },
      updateFeedbackStatusDto,
    );
  }

  async removeFeedback(id: string): Promise<boolean> {
    return await this.feedbackRepository.deleteMany({ id });
  }

  async removeReply(id: number): Promise<boolean> {
    return await this.replyRepository.deleteMany({ id });
  }
}
