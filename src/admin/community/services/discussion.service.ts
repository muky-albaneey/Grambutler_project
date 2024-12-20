import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscussionRepository } from '../repositories/discussion.repository';
import { Comment, Discussion } from '../entities/discussion.entity';
import {
  CreateCommentDto,
  CreateDiscussionDto,
  UpdateDiscussionDto,
} from '../dto/discussion.dto';
import { FilterDto } from 'src/utils/filter.dto';

@Injectable()
export class DiscussionService {
  constructor(private readonly discussionRepository: DiscussionRepository) {}

  async createDiscussion(
    createDiscussionDto: CreateDiscussionDto,
    userId: string,
  ): Promise<Discussion> {
    return await this.discussionRepository.create({
      ...createDiscussionDto,
      createdBy: userId,
    });
  }

  async createComment(
    discussionId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Discussion> {
    const discussion = await this.discussionRepository.findOne({
      id: discussionId,
    });

    createCommentDto.id = ++discussion.comments.length;
    discussion.comments.push(createCommentDto as Comment);
    return await this.discussionRepository.newSave(discussion);
  }

  async findAll(filter: FilterDto): Promise<Discussion[]> {
    return await this.discussionRepository.find({}, { ...filter });
  }

  async findOne(id: string): Promise<Discussion> {
    return await this.discussionRepository.findOne({ id });
  }

  async update(
    id: string,
    updateDiscussionDto: UpdateDiscussionDto,
  ): Promise<Discussion> {
    return await this.discussionRepository.findOneAndUpdate(
      { id },
      updateDiscussionDto,
    );
  }

  async removeDiscussion(id: string): Promise<boolean> {
    return await this.discussionRepository.deleteMany({ id });
  }

  async removeComment(
    discussionId: string,
    commentId: number,
  ): Promise<Discussion> {
    const discussion = await this.discussionRepository.findOne({
      id: discussionId,
    });

    if (!discussion || !discussion.comments) {
      throw new NotFoundException('Comment not found');
    }

    discussion.comments = discussion.comments.filter(
      (comment) => comment.id !== commentId,
    );

    return await this.discussionRepository.newSave(discussion);
  }
}
