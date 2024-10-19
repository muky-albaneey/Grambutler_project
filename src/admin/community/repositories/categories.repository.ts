import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'src/utils/entity.repository';

export class CategoryRepository extends EntityRepository<Category> {
  constructor(
    @InjectRepository(Category)
    readonly categoryModel: Repository<Category>,
  ) {
    super(categoryModel);
  }
}
