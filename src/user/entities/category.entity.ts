import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
  } from 'typeorm';
  import { Post } from './post.entity';
  
  
  @Entity()
  export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;
  
    @OneToMany(() => Post, (post) => post.category)
    posts: Post[];
  }
  
  