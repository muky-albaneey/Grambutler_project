import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { HttpModule } from '@nestjs/axios';
import { ResponseEntity } from 'src/user/entities/response.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forFeature([ResponseEntity]),HttpModule],
  exports: [TypeOrmModule],
  providers: [OpenaiService],
  controllers: [OpenaiController]
})
export class OpenaiModule {}
