import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum RoleEnum {
    ADMIN = 1,
    USER = 2,
}

@Entity()
export class Role {
    @PrimaryGeneratedColumn("increment", { type: "tinyint" })
    id: number;

    @Column("varchar", { length: 200 })
    roleName: string;

    @Column("varchar", { length: 200 })
    description?: string;
}
