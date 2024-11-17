import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EventType } from '../interfaces/events.interface';
import { User } from 'src/user/entities/user.entity';

@Entity('mentorship_events')
export class MentorshipEvent extends DefaultEntity {
  @Column({ nullable: false, type: 'uuid', name: 'created_by' })
  createdBy: string;

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

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
