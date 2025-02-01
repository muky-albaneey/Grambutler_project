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
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid', name: 'recommendation_id' })
  recommendationId: string;

  @ManyToOne(() => Recommendation, (recommendation) => recommendation.feedbacks)
  @JoinColumn({ name: 'recommendation_id', referencedColumnName: 'id' })
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({ nullable: false, type: 'uuid', name: 'feedback_id' })
  feedbackId: string;

  @ManyToOne(() => Feedback, (feedback) => feedback.replies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'feedback_id', referencedColumnName: 'id' })
  feedback: Feedback;

  @Column()
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
