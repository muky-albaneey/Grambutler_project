/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum Plan {
  BASIC = 'basic',
  PREMIUM = 'premium',
  PRO = 'pro',
}

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Plan
  })
  plan: Plan; // Using enum for the plan field

  @CreateDateColumn()
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ default: 'active' })
  status: string; // active, cancelled, expired

  // Relationships
  @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  user: User;
}
