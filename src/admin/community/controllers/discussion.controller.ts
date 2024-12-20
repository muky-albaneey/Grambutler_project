import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Discussion } from '../entities/discussion.entity';
import {
  CreateCommentDto,
  CreateDiscussionDto,
  UpdateDiscussionDto,
} from '../dto/discussion.dto';
import { DiscussionService } from '../services/discussion.service';
import { FilterDto } from 'src/utils/filter.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('discussion')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post()
  createDiscussion(
    @Body() createDiscussionDto: CreateDiscussionDto,
    @User('sub') userId: string,
  ): Promise<Discussion> {
    return this.discussionService.createDiscussion(createDiscussionDto, userId);
  }

  @Post(':id')
  createComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Discussion> {
    return this.discussionService.createComment(id, createCommentDto);
  }

  @Get()
  findAll(@Query() filter: FilterDto): Promise<Discussion[]> {
    return this.discussionService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Discussion> {
    return this.discussionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscussionDto: UpdateDiscussionDto,
  ): Promise<Discussion> {
    return this.discussionService.update(id, updateDiscussionDto);
  }

  @Delete(':id')
  removeDiscussion(@Param('id') id: string): Promise<boolean> {
    return this.discussionService.removeDiscussion(id);
  }

  @Delete(':id/:commentId')
  removeComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ): Promise<Discussion> {
    return this.discussionService.removeComment(id, parseInt(commentId));
  }
}
