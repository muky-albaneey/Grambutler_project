/* eslint-disable prettier/prettier */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
  } from 'typeorm';
//   import { User } from './user.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';
//   import { Comment } from './comment.entity';
//   import { Like } from './like.entity'; 
  
  @Entity()
  export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    title: string;
  
    @Column({ type: 'text' })
    content: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    // Relation to the User who created the post
    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    user: User;
  
    // Relation to the comments on this post
    @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
    comments: Comment[];
  
    // Relation to the likes on this post
    @OneToMany(() => Like, (like) => like.post, { cascade: true })
    likes: Like[];
  }
  