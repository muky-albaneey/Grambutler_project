  /* eslint-disable prettier/prettier */
  import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    OneToOne,
    JoinColumn
  } from 'typeorm';
  import { User } from './user.entity';
  import { Comment } from './comment.entity';
  import { Like } from './like.entity';
  import { Category } from './category.entity';
import { PostImage } from './post-image.entity';

  
@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;  

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @OneToOne(() => PostImage, { cascade: true, nullable: true })
  @JoinColumn()
  post_image?: PostImage; // Optional image

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post, { cascade: true })
  likes: Like[];

  @ManyToOne(() => Category, (category) => category.posts)
  category: Category;
}
