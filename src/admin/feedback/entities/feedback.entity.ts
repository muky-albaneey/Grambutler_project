import { DefaultEntity } from 'src/utils/default.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recommendation } from './recommendation.entity';
import { FeedbackStatus } from '../interfaces/feedback.interface';
import { User } from 'src/user/entities/user.entity';

@Entity('feedbacks')
export class Feedback extends DefaultEntity {
  @Column({ nullable: false, type: 'uuid', name: 'created_by' })
  createdBy: string;

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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}

@Entity('replies')
export class Reply {
  @Column({ nullable: false, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Feedback, (feedback) => feedback.replies)
  feedback: Feedback;

  @Column()
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
