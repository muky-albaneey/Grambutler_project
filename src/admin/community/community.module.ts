import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/community.controller';
import { DiscussionController } from './controllers/discussion.controller';
import { CategoryService } from './services/category.service';
import { DiscussionService } from './services/discussion.service';
import { DiscussionRepository } from './repositories/discussion.repository';
import { CategoryRepository } from './repositories/categories.repository';
import { Category } from './entities/category.entity';
import { Discussion } from './entities/discussion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Discussion])],
  controllers: [CategoryController, DiscussionController],
  providers: [
    CategoryRepository,
    CategoryService,
    DiscussionService,
    DiscussionRepository,
  ],
})
export class CommunityModule {}
