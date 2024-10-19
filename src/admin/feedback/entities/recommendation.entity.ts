import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RecommendationStatus } from '../interfaces/feedback.interface';
import { Feedback } from './feedback.entity';

@Entity('recommendations')
export class Recommendation extends DefaultEntity {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

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
}
