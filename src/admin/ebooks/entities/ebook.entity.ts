import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity } from 'typeorm';
import { BookCategory } from '../interfaces/ebook.interface';

@Entity('ebook')
export class Ebook extends DefaultEntity {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ enum: BookCategory, nullable: true })
  category: BookCategory;

  @Column()
  thumbnailURL: string;

  @Column()
  pdfURL: string;
}
