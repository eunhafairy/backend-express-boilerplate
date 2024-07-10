import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number

    @Column("varchar", {length: 200})
    firstName: string

    @Column("varchar", {length: 200})
    lastName: string

    @Column()
    isActive: boolean

    @Column("varchar")
    password: string
    
    @Column()
    email: string

    @Column()
    number: string

    @Column()
    username?: string

}