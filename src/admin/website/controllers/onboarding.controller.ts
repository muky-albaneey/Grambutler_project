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
import { Onboarding } from '../entities/onboarding.entity';
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
  ): Promise<Onboarding> {
    return this.onboardingService.create(createOnboardingDto, userId);
  }

  @Get()
  findAll(@Query() filter: FilterDto): Promise<Onboarding[]> {
    return this.onboardingService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Onboarding> {
    return this.onboardingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOnboardingDto: UpdateOnboardingDto,
  ): Promise<Onboarding> {
    return this.onboardingService.update(id, updateOnboardingDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.onboardingService.remove(id);
  }
}
