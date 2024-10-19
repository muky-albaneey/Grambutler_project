import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, Reply } from '../entities/feedback.entity';
import {
  CreateFeedbackDto,
  CreateReplyDto,
  UpdateFeedbackDto,
  UpdateFeedbackStatusDto,
} from '../dto/feedback.dto';
import { FilterDto } from 'src/utils/filter.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  createFeedback(
    @Body() createFeedbackDto: CreateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Post(':feedbackId')
  createReply(
    @Param('feedbackId', new ParseUUIDPipe()) id: string,
    @Body() createReplyDto: CreateReplyDto,
  ): Promise<Reply> {
    return this.feedbackService.createReply(id, createReplyDto);
  }

  @Get()
  findAll(@Query() filter: FilterDto): Promise<Feedback[]> {
    return this.feedbackService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Feedback> {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Patch(':id/status')
  updateFeedbackStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFeedbackStatusDto: UpdateFeedbackStatusDto,
  ): Promise<Feedback> {
    return this.feedbackService.updateFeedbackStatus(
      id,
      updateFeedbackStatusDto,
    );
  }

  @Delete(':id/reply')
  removeReply(@Param('id', new ParseIntPipe()) id: number): Promise<boolean> {
    return this.feedbackService.removeReply(id);
  }

  @Delete(':id')
  removeFeedback(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    return this.feedbackService.removeFeedback(id);
  }
}
