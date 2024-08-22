import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import { Role } from "./Role";

export enum UserRole {
    ADMIN = "admin",
    MODERATOR = "moderator",
    MEMBER = "member",
}

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

    @ManyToOne(() => Role, {nullable: false, eager: true})
    @JoinColumn({name: "roleId"})
    role: Role;
}
