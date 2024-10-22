import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Recommendation } from '../entities/recommendation.entity';
import {
  CreateRecommendationDto,
  UpdateRecommendationDto,
} from '../dto/recommendation.dto';
import { RecommendationService } from '../services/recommendation.service';
import { FilterDto } from 'src/utils/filter.dto';

@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  create(
    @Body() createRecommendationDto: CreateRecommendationDto,
  ): Promise<Recommendation> {
    return this.recommendationService.create(createRecommendationDto);
  }

  @Get()
  findAll(@Query() filter: FilterDto): Promise<Recommendation[]> {
    return this.recommendationService.findAll(filter);
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
