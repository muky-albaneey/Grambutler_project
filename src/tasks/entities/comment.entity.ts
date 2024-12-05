/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Task } from './task.entity';

@Entity()
export class Comment_task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Each comment belongs to a single task
  @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
  task: Task;

  // Each comment is created by a user (specifically the user who created the task)
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;
}
