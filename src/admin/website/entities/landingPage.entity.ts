import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity } from 'typeorm';
import { ImageCategory } from '../interfaces/website.interface';

@Entity('images')
export class PageImage extends DefaultEntity {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @Column({ type: 'enum', enum: ImageCategory })
  category: ImageCategory;

  @Column()
  imageName: string;

  @Column()
  imageURL: string;
}

@Entity('plans')
export class Plans extends DefaultEntity {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @Column()
  title: string;

  @Column('text', { array: true })
  access: string[];

  @Column({ type: 'money' })
  price: string;

  @Column('text', { array: true })
  features: string[];
}
