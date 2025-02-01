import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { DefaultEntity } from 'src/utils/default.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('discussions')
export class Discussion extends DefaultEntity {
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => Category, (category) => category.discussions)
  category: Category;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column(() => Comment)
  comments: Comment[];

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}

export class Comment {
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column()
  id: number;

  @Column()
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
