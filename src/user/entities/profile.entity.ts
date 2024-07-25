/* eslint-disable prettier/prettier */

import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity } from 'typeorm';
import { AbstractFileEntity } from './astract.entity';


@Entity()
export class ProfileImage extends AbstractFileEntity<ProfileImage> {
    
}