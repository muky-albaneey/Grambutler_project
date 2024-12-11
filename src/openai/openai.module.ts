/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { HttpModule } from '@nestjs/axios';
import { ResponseEntity } from 'src/user/entities/response.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
// import { PromptModule } from './prompt/prompt.module';
import { PromptEntity } from 'src/user/entities/reponse_prompt.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ResponseEntity, User, PromptEntity]),HttpModule, UserModule],
  exports: [TypeOrmModule],
  providers: [OpenaiService],
  controllers: [OpenaiController]
})

export class OpenaiModule {}
