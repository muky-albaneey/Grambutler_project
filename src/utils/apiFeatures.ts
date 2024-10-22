import { SelectQueryBuilder } from 'typeorm';

export class APIFeatures<T> {
  constructor(private readonly queryBuilder: SelectQueryBuilder<T>) {}

  filterStatus(status?: string): this {
    if (status) {
      this.queryBuilder.andWhere('entity.status = :status', { status });
    }
    return this;
  }

  search(search?: string): this {
    if (search) {
      this.queryBuilder.andWhere('entity.name ILIKE :search', {
        search: `%${search}%`,
      });
    }
    return this;
  }

  sort(sort?: string): this {
    if (sort) {
      this.queryBuilder.orderBy(
        'entity.createdAt',
        sort.toUpperCase() as 'ASC' | 'DESC',
      );
    }
    return this;
  }

  paginate(page?: number, limit?: number): this {
    if (page !== undefined && limit !== undefined) {
      const skip = (page - 1) * limit;
      this.queryBuilder.skip(skip).take(limit);
    }
    return this;
  }

  async exec(): Promise<T[]> {
    return this.queryBuilder.getMany();
  }
}
