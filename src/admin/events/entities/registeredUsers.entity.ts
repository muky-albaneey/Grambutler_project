import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity } from 'typeorm';

@Entity('registered_users')
export class RegisteredUser extends DefaultEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 140, nullable: false })
  email: string;
}
