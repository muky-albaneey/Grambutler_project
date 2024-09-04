import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Import the User entity

@Entity('responses')
export class ResponseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  prompt: string;

  @Column('text')
  response: string;

  @Column('timestamp')
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.responses, { nullable: false })
  user: User;
}
