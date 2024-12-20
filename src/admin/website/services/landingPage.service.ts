import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePageImageDto,
  CreatePlanDto,
  UpdatePageImageDto,
  UpdatePlanDto,
} from '../dto/landingPage.dto';
import { PageImage, Plans } from '../entities/landingPage.entity';
import { PageImageRepository, PlanRepository } from '../repositories';
import { FilterDto } from 'src/utils/filter.dto';
import { S3Service } from 'src/user/s3/s3.service';

@Injectable()
export class LandingPageService {
  constructor(
    private readonly pageImageRepository: PageImageRepository,
    private readonly planRepository: PlanRepository,
    private s3Service: S3Service,
  ) {}

  //#region Page Image
  createPageImage(createPageImageDto: CreatePageImageDto): Promise<PageImage> {
    return this.pageImageRepository.create(createPageImageDto);
  }

  findAllPageImage(filter: FilterDto): Promise<PageImage[]> {
    return this.pageImageRepository.find({}, { ...filter });
  }

  findOnePageImage(id: string): Promise<PageImage> {
    return this.pageImageRepository.findOne({ id });
  }

  async updatePageImage(
    id: string,
    updatePageImageDto: UpdatePageImageDto,
    image: Express.Multer.File,
  ): Promise<PageImage> {
    const imageFile = await this.pageImageRepository.findOne({ id });

    if (!imageFile) {
      throw new NotFoundException('Image File not found');
    }

    // Update files only if they are provided in the request
    if (image) {
      if (imageFile.imageURL) {
        //TODO: Delete old file
      }

      // Update with new file name
      updatePageImageDto.imageURL = await this.s3Service.uploadFile(image);
    }

    return this.pageImageRepository.findOneAndUpdate(
      { id },
      updatePageImageDto,
    );
  }

  removePageImage(id: string): Promise<boolean> {
    return this.pageImageRepository.deleteMany({ id });
  }
  //#endregion

  //#region Plan
  createPlan(createPlanDto: CreatePlanDto): Promise<Plans> {
    return this.planRepository.create(createPlanDto);
  }

  findAllPlan(filter: FilterDto): Promise<Plans[]> {
    return this.planRepository.find({}, { ...filter });
  }

  findOnePlan(id: string): Promise<Plans> {
    return this.planRepository.findOne({ id });
  }

  updatePlan(id: string, updatePlanDto: UpdatePlanDto): Promise<Plans> {
    return this.planRepository.findOneAndUpdate({ id }, updatePlanDto);
  }

  removePlan(id: string): Promise<boolean> {
    return this.planRepository.deleteMany({ id });
  }
  //#endregion
}
