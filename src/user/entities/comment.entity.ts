/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Post } from './post.entity';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn("uuid") 
    id: string;
  
    @Column({ type: 'text' })
    content: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    // Relation to the User who created the comment
    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user: User;
  
    // Relation to the Post on which the comment was made
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post;
  }
