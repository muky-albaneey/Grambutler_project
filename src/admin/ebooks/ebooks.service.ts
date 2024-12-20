import { Injectable, NotFoundException } from '@nestjs/common';
import { Ebook } from './entities/ebook.entity';
import { EbookRepository } from './repositories/ebook.repository';
import { CreateEbookDto, UpdateEbookDto } from './dto/ebook.dto';
import { join } from 'path';
import * as fs from 'fs';
import { FilterDto } from 'src/utils/filter.dto';

@Injectable()
export class EbooksService {
  constructor(private readonly ebooksRepository: EbookRepository) {}

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
        try {
          const oldPdfPath = join(__dirname, '../../uploads', ebook.pdfURL);
          fs.unlinkSync(oldPdfPath);
        } catch (error) {
          throw new NotFoundException(
            'The current file on the ebook could not be found',
          );
        }
      }

      // Update with new file name
      updateEbookDto.pdfURL = files.pdf[0].filename;
    }

    if (files?.thumbnail && files.thumbnail[0]) {
      // Delete the old thumbnail file
      if (ebook.thumbnailURL) {
        try {
          const oldThumbnailPath = join(
            __dirname,
            '../../uploads',
            ebook.thumbnailURL,
          );
          fs.unlinkSync(oldThumbnailPath);
        } catch (error) {
          throw new NotFoundException(
            'The current file on the ebook could not be found',
          );
        }
      }

      // Update with new file name
      updateEbookDto.thumbnailURL = files.thumbnail[0].filename;
    }

    return await this.ebooksRepository.findOneAndUpdate({ id }, updateEbookDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.ebooksRepository.deleteMany({ id });
  }
}
