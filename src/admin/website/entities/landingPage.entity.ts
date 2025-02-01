import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ImageCategory } from '../interfaces/website.interface';
import { User } from 'src/user/entities/user.entity';

@Entity('images')
export class PageImage extends DefaultEntity {
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({ type: 'enum', enum: ImageCategory })
  category: ImageCategory;

  @Column()
  imageName: string;

  @Column()
  imageURL: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}

@Entity('plans')
export class Plans extends DefaultEntity {
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column()
  title: string;

  @Column('text', { array: true })
  access: string[];

  @Column({ type: 'money' })
  price: string;

  @Column('text', { array: true })
  features: string[];

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
