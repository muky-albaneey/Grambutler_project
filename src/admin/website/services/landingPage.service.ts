import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePageImageDto,
  CreatePlanDto,
  UpdatePageImageDto,
  UpdatePlanDto,
} from '../dto/landingPage.dto';
import { PageImage, Plans } from '../entities/landingPage.entity';
import { PageImageRepository, PlanRepository } from '../repositories';
import { join } from 'path';
import * as fs from 'fs';
import { FilterDto } from 'src/utils/filter.dto';

@Injectable()
export class LandingPageService {
  constructor(
    private readonly pageImageRepository: PageImageRepository,
    private readonly planRepository: PlanRepository,
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
      // Delete the old image file
      if (imageFile.imageURL) {
        try {
          const oldimagePath = join(
            __dirname,
            '../../uploads',
            imageFile.imageURL,
          );
          fs.unlinkSync(oldimagePath);
        } catch (error) {
          throw new NotFoundException(
            'The current file on the imageFile could not be found',
          );
        }
      }

      // Update with new file name
      updatePageImageDto.imageURL = image.filename;
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
