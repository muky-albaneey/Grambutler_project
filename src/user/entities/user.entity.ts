/* eslint-disable prettier/prettier */

import {
    Entity,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';

import { Onboarding } from './onoard.entity';
import { ProfileImage } from './profile.entity';
import { Settings } from './setting.entity';
import { ResponseEntity } from './response.entity';
import { PromptEntity } from './reponse_prompt.entity';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { DefaultEntity } from 'src/utils/default.entity';
import { Payment } from './payment.entity';
import { Subscription } from './subscription.entity';


export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

export enum SubscriptionType {
    FREE = 'free',
    PREMIUM = 'premium',
    PRO = 'pro',
}


@Entity()
export class User extends DefaultEntity {
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

    @OneToOne(() => Onboarding, { cascade: true, nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn()
    onboard_info?: Onboarding;

    @OneToOne(() => ProfileImage, { cascade: true , nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    @JoinColumn()
    profile_image?: ProfileImage;

    @OneToOne(() => Settings, { cascade: true, nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn()
    settings?: Settings;

   
    @OneToMany(() => ResponseEntity, (caption_responses) => caption_responses.user, { cascade: true , onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    caption_responses?: ResponseEntity[];

    @OneToMany(() => PromptEntity, (prompt_responses) => prompt_responses.user, { cascade: true , onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    prompt_responses?: PromptEntity[];

    @ManyToMany(() => User, (user) => user.followers)
    @JoinTable({
        name: 'user_followers',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'followerId',
            referencedColumnName: 'id'
        }
    })
    following: User[];

    @ManyToMany(() => User, (user) => user.following, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE'  })
    followers: User[];


     @OneToMany(() => Post, (post) => post.user, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE'  })
     posts: Post[];
    
     @OneToMany(() => Comment, (comment) => comment.user, { cascade: true , onUpdate: 'CASCADE', onDelete: 'CASCADE' })
     comments: Comment[];
   
     @OneToMany(() => Like, (like) => like.user, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE'  })
     likes: Like[];

     @OneToMany(() => Task, (task) => task.user, { cascade: true, onUpdate: 'CASCADE' , onDelete: 'CASCADE' })
    tasks: Task[];

    @OneToMany(() => Payment, (payment) => payment.user, { cascade: true, onDelete: 'CASCADE' })
    payments: Payment[];

    @Column({ type: 'boolean', nullable: true })
    isActiveSubscriber: boolean;
    
    // @Column({ type: 'boolean', nullable: true })
    // isPremiumSubscription: boolean;
    
    // @Column({ type: 'enum', enum: SubscriptionType, nullable: true })
    // subscriptionLevel: SubscriptionType;

      // Relationships
  @OneToMany(() => Subscription, (subscription) => subscription.user, { cascade: true })
  subscriptions: Subscription[];

    constructor(user :Partial<User>){
        super();
        Object.assign(this, user)
    }
   
}

