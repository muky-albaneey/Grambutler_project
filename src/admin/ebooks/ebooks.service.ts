import { Injectable, NotFoundException } from '@nestjs/common';
import { Ebook } from './entities/ebook.entity';
import { EbookRepository } from './repositories/ebook.repository';
import { CreateEbookDto, UpdateEbookDto } from './dto/ebook.dto';
import { FilterDto } from 'src/utils/filter.dto';
import { S3Service } from 'src/user/s3/s3.service';

@Injectable()
export class EbooksService {
  constructor(
    private readonly ebooksRepository: EbookRepository,
    private s3Service: S3Service,
  ) {}

  async createEbook(
    createEbookDto: CreateEbookDto,
    userId: string,
  ): Promise<Ebook> {
    return await this.ebooksRepository.create({
      ...createEbookDto,
      createdBy: userId,
    });
  }

  async findAll(filter: FilterDto): Promise<Ebook[]> {
    return await this.ebooksRepository.find({}, { ...filter });
  }

  async findOne(id: string): Promise<Ebook> {
    return await this.ebooksRepository.findOne({ id });
  }

  async update(
    id: string,
    updateEbookDto: UpdateEbookDto,
    files: { pdf: Express.Multer.File; thumbnail: Express.Multer.File },
  ): Promise<Ebook> {
    const ebook = await this.ebooksRepository.findOne({ id });

    if (!ebook) {
      throw new NotFoundException('Ebook not found');
    }

    // Update files only if they are provided in the request
    if (files?.pdf && files.pdf[0]) {
      // Delete the old PDF file
      if (ebook.pdfURL) {
        //TODO: Delete old file
      }

      // Update with new file name
      updateEbookDto.pdfURL = await this.s3Service.uploadFile(files.pdf[0]);
    }

    if (files?.thumbnail && files.thumbnail[0]) {
      // Delete the old thumbnail file
      if (ebook.thumbnailURL) {
        //TODO: Delete old file
      }

      // Update with new file name
      updateEbookDto.thumbnailURL = await this.s3Service.uploadFile(
        files.thumbnail[0],
      );
    }

    return await this.ebooksRepository.findOneAndUpdate({ id }, updateEbookDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.ebooksRepository.deleteMany({ id });
  }
}
