/* eslint-disable prettier/prettier */
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

export enum NotificationType {
  FOLLOW = 'follow',
  UNFOLLOW = 'unfollow',
  LIKE = 'like',
  COMMENT = 'comment',
  POST = 'post',
  SUBSCRIPTION = 'subscription',
  ACCOUNT_DELETION = 'delete',
}


@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string; // e.g., "ORDER_UPDATE", "NEW_MESSAGE"

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;
  

  @CreateDateColumn()
  createdAt: Date;

  // Relationship with User
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;
}
