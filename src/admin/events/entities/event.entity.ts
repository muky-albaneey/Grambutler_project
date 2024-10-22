import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity } from 'typeorm';
import { EventType } from '../interfaces/events.interface';

@Entity('mentorship_events')
export class MentorshipEvent extends DefaultEntity {
  //   @OneToOne((type) => User, (user) => user.posts)
  //   createdBy: User;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: EventType, default: EventType.Upcoming })
  eventType: EventType;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: Date;

  @Column()
  thumbnailURL: string;

  @Column()
  link: string;
}
