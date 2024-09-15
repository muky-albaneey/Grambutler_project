/* eslint-disable prettier/prettier */

import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity } from 'typeorm';
import { AbstractFileEntity } from './abstract.entity';
import { Post } from './post.entity';


@Entity()
export class PostImage extends AbstractFileEntity<PostImage> {
  @OneToOne(() => Post)
  @JoinColumn()
  post: Post;
}
