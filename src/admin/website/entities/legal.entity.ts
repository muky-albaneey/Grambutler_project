import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity } from 'typeorm';

@Entity('legal')
export class Legal extends DefaultEntity {
  // @ManyToOne(() => User, (user) => user.photos)
  // createdBy: User;

  @Column()
  termsURL: string;

  @Column()
  privacyURL: string;

  @Column()
  securityURL: string;
}
