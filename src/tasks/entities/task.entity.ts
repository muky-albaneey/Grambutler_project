import { User } from 'src/user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  @Entity()
  export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    guest: string;
  
    @Column({ type: 'timestamp' })
    startDate: Date;
  
    @Column({ type: 'timestamp' })
    dueDate: Date;
  
    @Column({ type: 'varchar', length: 100 })
    timeZone: string;
  
    @Column({ type: 'varchar', length: 50, nullable: true })
    repeat: string;
  
    @Column({ type: 'varchar', length: 50 })
    priority: string;
  
    @Column({ type: 'varchar', length: 50 })
    taskStatus: string;
  
    @Column({ type: 'int', nullable: true })
    startReminder: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ type: 'text', nullable: true })
    message?: string; // Field for messages
    
    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'SET NULL', nullable: true })
    user: User; // Reference to User entity
  }
  