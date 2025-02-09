import { DefaultEntity } from 'src/utils/default.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionType } from '../interfaces/website.interface';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { User } from 'src/user/entities/user.entity';

@Entity({ name: 'admin_onboarding' })
export class AdminOnboarding extends DefaultEntity {
  @Column({ nullable: true, type: 'uuid', name: 'created_by' })
  createdBy: string;

  @Column({ nullable: true })
  category: string;

  @OneToMany(() => Question, (question) => question.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  questions: Question[];

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: User;
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'uuid', name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => AdminOnboarding, (onboarding) => onboarding.questions)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: AdminOnboarding;

  @Column()
  @IsString()
  @IsNotEmpty()
  question: string;

  @Column()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Column({ type: 'enum', enum: QuestionType })
  @IsEnum(QuestionType)
  type: QuestionType;

  @Column('text', { array: true, nullable: true })
  @ValidateIf(
    (o) => o.type === QuestionType.Checkbox || o.type === QuestionType.Radio,
  )
  @IsArray()
  @IsString({ each: true })
  options: string[];
}
