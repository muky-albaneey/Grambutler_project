/* eslint-disable prettier/prettier */

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    BeforeInsert,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Onboarding } from './onoard.entity';
import { ProfileImage } from './profile.entity';
import { Settings } from './setting.entity';
import { ResponseEntity } from './response.entity';
import { PromptEntity } from './reponse_prompt.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Task } from 'src/tasks/entities/task.entity';


export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable : true, type : 'varchar'})
    full_name?: string;

    @Column({ type: 'varchar', length: 140, unique : true, nullable: false })
    email: string;

    @Column({ type: 'varchar', nullable: false  })
    password: string;

    @Column({type: 'varchar', nullable : true})
    country?: string;

    @Column({type: 'varchar', nullable : true})
    state?: string;

    @Column({type: 'varchar', nullable : true})
    rememberToken?: string;
    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER, nullable: false 
    })
    role: UserRole

    @OneToOne(() => Onboarding, { cascade: true, nullable: true, onUpdate: 'CASCADE' })
    @JoinColumn()
    onboard_info?: Onboarding;

    @OneToOne(() => ProfileImage, { cascade: true , nullable: true, onUpdate: 'CASCADE'})
    @JoinColumn()
    profile_image?: ProfileImage;

    @OneToOne(() => Settings, { cascade: true, nullable: true, onUpdate: 'CASCADE' })
    @JoinColumn()
    settings?: Settings;

   
    @OneToMany(() => ResponseEntity, (caption_responses) => caption_responses.user, { cascade: true , onUpdate: 'CASCADE'})
    caption_responses?: ResponseEntity[];

    @OneToMany(() => PromptEntity, (prompt_responses) => prompt_responses.user, { cascade: true , onUpdate: 'CASCADE'})
    prompt_responses?: PromptEntity[];

    @ManyToMany(() => User, (user) => user.followers)
    @JoinTable({
        name: 'user_followers',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'followerId',
            referencedColumnName: 'id',
        },
    })
    following: User[];

    @ManyToMany(() => User, (user) => user.following)
    followers: User[];


     @OneToMany(() => Post, (post) => post.user, { cascade: true, onUpdate: 'CASCADE' })
     posts: Post[];
   
     @OneToMany(() => Comment, (comment) => comment.user, { cascade: true , onUpdate: 'CASCADE'})
     comments: Comment[];
   
     @OneToMany(() => Like, (like) => like.user, { cascade: true, onUpdate: 'CASCADE' })
     likes: Like[];

     @OneToMany(() => Task, (task) => task.user, { cascade: true, onUpdate: 'CASCADE' })
    tasks: Task[];
    constructor(user :Partial<User>){
        Object.assign(this, user)
    }
   
}

