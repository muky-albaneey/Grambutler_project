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
// import { ProfileBg } from './profile-bg.entity';
// import { ProfileImage } from './profile-image.entity';
// import { File } from 'src/files/entities/file.entity';


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

//     @BeforeInsert()
//     async hashPassword(){
//       this.password = await bcrypt.hash(this.password, 10);        
//    }

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

    @OneToOne(() => Onboarding, { cascade: true, nullable: true })
    @JoinColumn()
    onboard_info?: Onboarding;

    @OneToOne(() => ProfileImage, { cascade: true , nullable: true})
    @JoinColumn()
    profile_image?: ProfileImage;

    @OneToOne(() => Settings, { cascade: true, nullable: true })
    @JoinColumn()
    settings?: Settings;

   
    @OneToMany(() => ResponseEntity, (caption_responses) => caption_responses.user, { cascade: true })
    caption_responses?: ResponseEntity[];

    @OneToMany(() => PromptEntity, (prompt_responses) => prompt_responses.user, { cascade: true })
    prompt_responses?: PromptEntity[];

     // Many-to-Many relation for followers and following
    //  @ManyToMany(() => User, (user) => user.following)
    //  @JoinTable({
    //      name: 'user_followers', // Custom table name for the relation
    //      joinColumn: {
    //          name: 'userId',
    //          referencedColumnName: 'id',
    //      },
    //      inverseJoinColumn: {
    //          name: 'followerId',
    //          referencedColumnName: 'id',
    //      },
    //  })
    //  followers: User[];
 
    //  @ManyToMany(() => User, (user) => user.followers)
    //  following: User[];
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


     @OneToMany(() => Post, (post) => post.user, { cascade: true })
     posts: Post[];
   
     @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
     comments: Comment[];
   
     @OneToMany(() => Like, (like) => like.user, { cascade: true })
     likes: Like[];

    constructor(user :Partial<User>){
        Object.assign(this, user)
    }
   
}

