import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { DefaultEntity } from 'src/utils/default.entity';

@Entity('discussions')
export class Discussion extends DefaultEntity {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @ManyToOne(() => Category, (category) => category.discussions)
  category: Category;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column(() => Comment)
  comments: Comment[];
}

export class Comment {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @Column()
  id: number;

  @Column()
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
