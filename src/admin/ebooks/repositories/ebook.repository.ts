import { Repository } from 'typeorm';
import { Ebook } from '../entities/ebook.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from 'src/utils/entity.repository';

export class EbookRepository extends EntityRepository<Ebook> {
  constructor(
    @InjectRepository(Ebook)
    private readonly ebookModel: Repository<Ebook>,
  ) {
    super(ebookModel);
  }
}
