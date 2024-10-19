import { DefaultEntity } from 'src/utils/default.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recommendation } from './recommendation.entity';
import { FeedbackStatus } from '../interfaces/feedback.interface';

@Entity('feedbacks')
export class Feedback extends DefaultEntity {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @ManyToOne(() => Recommendation, (recommendation) => recommendation.feedbacks)
  recommendation: Recommendation;

  @Column()
  feedbackText: string;

  @Column({
    enum: FeedbackStatus,
    nullable: true,
    default: FeedbackStatus.Open,
  })
  status: FeedbackStatus;

  @OneToMany(() => Reply, (reply) => reply.feedback, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  replies: Reply[];
}

@Entity('replies')
export class Reply {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feedback, (feedback) => feedback.replies)
  feedback: Feedback;

  @Column()
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
