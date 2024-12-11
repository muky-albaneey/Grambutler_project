/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentIntentId: string;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
