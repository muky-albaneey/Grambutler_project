import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { HttpModule } from '@nestjs/axios';
import { ResponseEntity } from 'src/user/entities/response.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { PromptModule } from './prompt/prompt.module';

@Module({
  imports: [ TypeOrmModule.forFeature([ResponseEntity, User]),HttpModule, UserModule, PromptModule],
  exports: [TypeOrmModule],
  providers: [OpenaiService],
  controllers: [OpenaiController]
})

export class OpenaiModule {}
