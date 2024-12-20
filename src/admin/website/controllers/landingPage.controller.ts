import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { LandingPageService } from '../services';
import {
  CreatePageImageDto,
  CreatePlanDto,
  UpdatePageImageDto,
  UpdatePlanDto,
} from '../dto/landingPage.dto';
import { PageImage, Plans } from '../entities/landingPage.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileInterceptor } from 'src/utils/file.validator';
import { FilterDto } from 'src/utils/filter.dto';
import { S3Service } from 'src/user/s3/s3.service';

@Controller('landingPage')
export class LandingPageController {
  constructor(
    private readonly landingPageService: LandingPageService,
    private s3Service: S3Service,
  ) {}

  //#region Page Image
  @Post('/images')
  @UseInterceptors(FileInterceptor('image', fileInterceptor))
  async createPageImage(
    @Body() createPageImageDto: CreatePageImageDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PageImage> {
    createPageImageDto.imageURL = await this.s3Service.uploadFile(image);
    return this.landingPageService.createPageImage(createPageImageDto);
  }

  @Get('/images')
  findAllPageImage(@Query() filter: FilterDto): Promise<PageImage[]> {
    return this.landingPageService.findAllPageImage(filter);
  }

  @Get('/images/:id')
  findOnePageImage(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<PageImage> {
    return this.landingPageService.findOnePageImage(id);
  }

  @Patch('/images/:id')
  @UseInterceptors(FileInterceptor('image', fileInterceptor))
  updatePageImage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateLandingPageDto: UpdatePageImageDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<PageImage> {
    return this.landingPageService.updatePageImage(
      id,
      updateLandingPageDto,
      image,
    );
  }

  @Delete('/images/:id')
  removePageImage(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<boolean> {
    return this.landingPageService.removePageImage(id);
  }
  //#endregion

  //#region Plans
  @Post('/')
  createPlan(@Body() createPlanDto: CreatePlanDto): Promise<Plans> {
    return this.landingPageService.createPlan(createPlanDto);
  }

  @Get('/')
  findAllPlan(@Query() filter: FilterDto): Promise<Plans[]> {
    return this.landingPageService.findAllPlan(filter);
  }

  @Get('/:id')
  findOnePlan(@Param('id', new ParseUUIDPipe()) id: string): Promise<Plans> {
    return this.landingPageService.findOnePlan(id);
  }

  @Patch('/:id')
  updatePlan(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateLandingPageDto: UpdatePlanDto,
  ): Promise<Plans> {
    return this.landingPageService.updatePlan(id, updateLandingPageDto);
  }

  @Delete('/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.landingPageService.removePlan(id);
  }
  //#endregion
}
