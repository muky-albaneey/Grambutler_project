import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { APIFeatures } from './apiFeatures';
import { NotFoundException } from '@nestjs/common';

export abstract class EntityRepository<T extends ObjectLiteral> {
  constructor(protected readonly entityModel: Repository<T>) {}

  async findOne(
    entityFilterQuery: FindOptionsWhere<T>,
    projection?: FindOptionsSelect<T>,
    populate?: FindOptionsRelations<T>,
  ): Promise<T | null> {
    return await this.entityModel.findOne({
      where: entityFilterQuery,
      select: projection,
      relations: populate,
    });
  }

  async find(
    entityFilterQuery: FindOptionsWhere<T>,
    options?: {
      projection?: string[];
      populate?: string[];
      status?: string;
      search?: string;
      sort?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<T[] | null> {
    const metadata = this.entityModel.metadata;
    const entityName = metadata.name;

    const query = this.entityModel
      .createQueryBuilder(entityName)
      .where(entityFilterQuery);

    if (options?.populate) {
      options.populate.forEach((popString) => {
        query.leftJoinAndSelect(`${entityName}.${options.populate}`, popString);
      });
    }

    if (options?.projection) {
      query.select(options.projection);
    }

    const newQuery = new APIFeatures(query)
      .filterStatus(options?.status)
      .search(options?.search)
      .sort(options?.sort)
      .paginate(options?.page, options?.limit);

    return await newQuery.exec();
  }

  async create(createEntityData: DeepPartial<T>): Promise<T> {
    const entity = this.entityModel.create(createEntityData);
    return await this.entityModel.save(entity);
  }

  async createMany(
    createEntityData: QueryDeepPartialEntity<T>[],
  ): Promise<T[]> {
    const results = await this.entityModel.insert(createEntityData);

    const ids = results.generatedMaps.map((entity) => entity.id);

    return await this.entityModel.findByIds(ids);
  }

  async findOneAndUpdate(
    entityFilterQuery: FindOptionsWhere<T>,
    updateEntityData: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    // Perform the update
    await this.entityModel.update(entityFilterQuery, updateEntityData);

    // Fetch the updated entity
    const updatedEntity = await this.entityModel.findOne({
      where: entityFilterQuery,
    });

    // Check if the entity was found and updated
    if (!updatedEntity) {
      throw new NotFoundException('Entity not found');
    }

    return updatedEntity;
  }

  async deleteMany(entityFilterQuery: FindOptionsWhere<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.delete(entityFilterQuery);
    return deleteResult.affected >= 1;
  }
}
