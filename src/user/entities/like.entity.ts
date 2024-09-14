/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from './user.entity';
  import { Post } from './post.entity';
  
  @Entity()
  export class Like {
    @PrimaryGeneratedColumn("uuid")
    id: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    // Relation to the User who liked the post
    @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
    user: User;
  
    // Relation to the Post that was liked
    @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
    post: Post;
  }
  