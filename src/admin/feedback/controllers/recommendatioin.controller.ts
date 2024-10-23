import {
  Body,
  Controller,
  Delete,
  Get,
  Res,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { Recommendation } from '../entities/recommendation.entity';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '../dto/recommendation.dto';
import { RecommendationService } from '../services/recommendation.service';
import { FilterDto } from 'src/utils/filter.dto';
import type { Response } from 'express';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  create(
    @Body() createRecommendationDto: CreateRecommendationDto, @Res({ passthrough: true }) res: Response
  ): Promise<Recommendation> {
    const result = this.recommendationService.create(createRecommendationDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Recommendation created successfully',
      data: result,
    });
  }

  @Get()
  findAll(@Query() filter: FilterDto, @Res({ passthrough: true }) res: Response ): Promise<Recommendation[]> {
    const result = this.recommendationService.findAll(filter);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Recommendation fetched successfully',
      data: result,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Recommendation> {
    return this.recommendationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRecommendationDto: UpdateRecommendationDto,
  ): Promise<Recommendation> {
    return this.recommendationService.update(id, updateRecommendationDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.recommendationService.remove(id);
  }
}
