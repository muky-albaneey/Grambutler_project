import { Module } from '@nestjs/common';
import { EbooksService } from './ebooks.service';
import { EbooksController } from './ebooks.controller';
import { EbookRepository } from './repositories/ebook.repository';
import { Ebook } from './entities/ebook.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Ebook])],
  controllers: [EbooksController],
  providers: [EbookRepository, EbooksService],
})
export class EbooksModule {}
