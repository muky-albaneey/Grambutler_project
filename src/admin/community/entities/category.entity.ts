import { Column, Entity, OneToMany } from 'typeorm';
import { Discussion } from './discussion.entity';
import { DefaultEntity } from 'src/utils/default.entity';

@Entity('categories')
export class Category extends DefaultEntity {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @Column()
  color: string;

  @Column()
  name: string;

  @OneToMany(() => Discussion, (discussion) => discussion.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  discussions: Discussion[];
}
