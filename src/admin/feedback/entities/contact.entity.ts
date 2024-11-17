import { DefaultEntity } from 'src/utils/default.entity';
import { Column, Entity } from 'typeorm';
import {
  CompanySize,
  JobFunction,
  JobLevel,
} from '../interfaces/feedback.interface';

@Entity('contacts')
export class Contact extends DefaultEntity {
  @Column()
  email: string;

  @Column()
  country: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  website: string;

  @Column({
    type: 'enum',
    enum: JobFunction,
  })
  job: JobFunction;

  @Column({
    type: 'enum',
    enum: JobLevel,
  })
  level: JobLevel;

  @Column({
    type: 'enum',
    enum: CompanySize,
  })
  size: CompanySize;

  @Column('text')
  additionalInfo: string;
}
