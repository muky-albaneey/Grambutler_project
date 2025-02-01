import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Discussion } from './discussion.entity';
import { User } from 'src/user/entities/user.entity';
import { DefaultEntity } from 'src/utils/default.entity';

@Entity('categories')
export class Category extends DefaultEntity {
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column()
  color: string;

  @Column()
  name: string;

  @OneToMany(() => Discussion, (discussion) => discussion.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  discussions: Discussion[];

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
