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
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { EbooksService } from './ebooks.service';
import { Ebook } from './entities/ebook.entity';
import { CreateEbookDto, UpdateEbookDto } from './dto/ebook.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileInterceptor } from 'src/utils/file.validator';
import { FilterDto } from 'src/utils/filter.dto';
import { User } from 'src/decorators/user.decorator';
import { S3Service } from 'src/user/s3/s3.service';

@Controller('ebooks')
export class EbooksController {
  constructor(
    private readonly ebooksService: EbooksService,
    private s3Service: S3Service,
  ) {}

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdf', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      fileInterceptor,
    ),
  )
  async createEbook(
    @Body() createEbookDto: CreateEbookDto,
    @User('sub') userId: string,
    @UploadedFiles()
    files: { pdf: Express.Multer.File; thumbnail: Express.Multer.File },
  ): Promise<Ebook> {
    createEbookDto.pdfURL = await this.s3Service.uploadFile(files?.pdf[0]);
    createEbookDto.thumbnailURL = await this.s3Service.uploadFile(
      files?.thumbnail[0],
    );
    return this.ebooksService.createEbook(createEbookDto, userId);
  }

  @Get('/')
  findAll(@Query() filter: FilterDto): Promise<Ebook[]> {
    return this.ebooksService.findAll(filter);
  }

  @Get('/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Ebook> {
    return this.ebooksService.findOne(id);
  }

  @Patch('/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdf', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      fileInterceptor,
    ),
  )
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEbookDto: UpdateEbookDto,
    @UploadedFiles()
    files: { pdf: Express.Multer.File; thumbnail: Express.Multer.File },
  ): Promise<Ebook> {
    return this.ebooksService.update(id, updateEbookDto, files);
  }

  @Delete('/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<boolean> {
    return this.ebooksService.remove(id);
  }
}
