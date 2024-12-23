import { Module } from '@nestjs/common';
import { EbooksService } from './ebooks.service';
import { EbooksController } from './ebooks.controller';
import { EbookRepository } from './repositories/ebook.repository';
import { Ebook } from './entities/ebook.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ebook]), UserModule],
  controllers: [EbooksController],
  providers: [EbookRepository, EbooksService],
})
export class EbooksModule {}
