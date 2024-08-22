import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 200 })
    firstName: string;

    @Column("varchar", { length: 200 })
    lastName: string;

    @Column()
    isActive: boolean;

    @Column("varchar")
    password: string;

    @Column({ unique: true, type: "varchar", length: 200 })
    email: string;

    @Column({ unique: true, type: "varchar", length: 200 })
    number: string;

    @Column({ unique: true, type: "varchar", length: 200 })
    username: string;
}
