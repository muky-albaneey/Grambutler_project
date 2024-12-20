import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { FilterDto } from 'src/utils/filter.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<Category> {
    return this.categoryRepository.create({
      ...createCategoryDto,
      createdBy: userId,
    });
  }

  findAll(filter: FilterDto): Promise<Category[]> {
    return this.categoryRepository.find({}, { ...filter });
  }

  findOne(id: string): Promise<Category> {
    return this.categoryRepository.findOne({ id });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoryRepository.findOneAndUpdate({ id }, updateCategoryDto);
  }

  remove(id: string): Promise<boolean> {
    return this.categoryRepository.deleteMany({ id });
  }
}
