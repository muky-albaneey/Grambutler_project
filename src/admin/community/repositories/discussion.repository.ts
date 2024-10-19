import { InjectRepository } from '@nestjs/typeorm';
import { Discussion } from '../entities/discussion.entity';
import { Repository } from 'typeorm';
import { EntityRepository } from 'src/utils/entity.repository';

export class DiscussionRepository extends EntityRepository<Discussion> {
  constructor(
    @InjectRepository(Discussion)
    readonly discussionModel: Repository<Discussion>,
  ) {
    super(discussionModel);
  }

  async newSave(discussion: Discussion): Promise<Discussion> {
    return await this.discussionModel.save(discussion);
  }
}
