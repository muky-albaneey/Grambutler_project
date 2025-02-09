import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { OnboardingService } from '../services';
import { AdminOnboarding } from '../entities/onboarding.entity';
import {
  CreateOnboardingDto,
  UpdateOnboardingDto,
} from '../dto/onboarding.dto';
import { FilterDto } from 'src/utils/filter.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  create(
    @Body() createOnboardingDto: CreateOnboardingDto,
    @User('sub') userId: string,
  ): Promise<AdminOnboarding> {
    return this.onboardingService.create(createOnboardingDto, userId);
  }

  @Get()
  findAll(@Query() filter: FilterDto): Promise<AdminOnboarding[]> {
    return this.onboardingService.findAll(filter);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<AdminOnboarding> {
    return this.onboardingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOnboardingDto: UpdateOnboardingDto,
  ): Promise<AdminOnboarding> {
    return this.onboardingService.update(id, updateOnboardingDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.onboardingService.remove(id);
  }
}
