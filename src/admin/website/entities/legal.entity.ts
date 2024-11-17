import { User } from 'src/user/entities/user.entity';
import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('legal')
export class Legal extends DefaultEntity {
  @Column({ nullable: false, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column()
  termsURL: string;

  @Column()
  privacyURL: string;

  @Column()
  securityURL: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}
