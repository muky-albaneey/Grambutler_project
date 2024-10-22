import { InjectRepository } from '@nestjs/typeorm';
import { Feedback, Reply } from '../entities/feedback.entity';
import { EntityRepository } from 'src/utils/entity.repository';
import { Repository } from 'typeorm';

export class FeedbackRepository extends EntityRepository<Feedback> {
  constructor(
    @InjectRepository(Feedback)
    readonly feedbackModel: Repository<Feedback>,
  ) {
    super(feedbackModel);
  }

  async newSave(feedback: Feedback): Promise<Feedback> {
    return await this.feedbackModel.save(feedback);
  }
}

export class ReplyRepository extends EntityRepository<Reply> {
  constructor(
    @InjectRepository(Reply)
    readonly replyModel: Repository<Reply>,
  ) {
    super(replyModel);
  }
}
