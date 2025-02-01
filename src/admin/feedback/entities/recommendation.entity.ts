import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { RecommendationStatus } from '../interfaces/feedback.interface';
import { Feedback } from './feedback.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('recommendations')
export class Recommendation extends DefaultEntity {
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({
    type: 'enum',
    enum: RecommendationStatus,
    default: RecommendationStatus.Pending,
  })
  status: RecommendationStatus;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => Feedback, (feedback) => feedback.recommendation, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  feedbacks: Feedback[];

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
