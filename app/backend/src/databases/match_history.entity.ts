import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import { User } from "./user.entity"


@Entity('Match_history')
export class Match_history extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => User, (user) => user.match_history, {nullable: true})
    user: User

    @Column()
    opponent: number
    
    @Column({default: 0})
    user_score: number

    @Column({default: 0})
    opponent_score: number
    
}