import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BookCategory } from '../interfaces/ebook.interface';
import { User } from 'src/user/entities/user.entity';

@Entity('ebook')
export class Ebook extends DefaultEntity {
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

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

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
