import { OneToOne, JoinColumn, OneToMany, ManyToOne, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity()
export class Settings{
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({nullable : true, length: 190, type: 'varchar'})
    firstname?: string;

    @Column({ type: 'varchar', length: 190, nullable: false })
    lastname: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    email: string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    username : string;

    @Column({ type: 'varchar', length: 190, nullable: false  })
    location: string;

    


    constructor(setting :Partial<Settings>){
        Object.assign(this, setting)
    }
}   