import RoleContext from "../../data-access/context/RoleContext";
import { Role, RoleEnum } from "../../data-access/entities/Role";
import { RoleModel } from "../data-models/Role";
import BaseManager from "./BaseManager";

export default class RoleManager extends BaseManager<
    RoleContext,
    Role,
    RoleModel
> {
    constructor() {
        super();
        this.context = new RoleContext();
    }

    public entityToModelMapper(entity: Role): RoleModel {
        return {
            roleName: entity.roleName,
            description: entity?.description,
        };
    }

    public async populateRoleTable() {
        const adminRole = new Role();
        adminRole.roleName = "Admin";
        adminRole.description = "With great power comes great responsibility";
        adminRole.roleId = RoleEnum.ADMIN;
        await this.context.insert(adminRole);

        const userRole = new Role();
        userRole.roleName = "User";
        userRole.description = "Just happy to be here";
        userRole.roleId = RoleEnum.USER;
        await this.context.insert(userRole);
    }

    public async getRoles(): Promise<RoleModel[]> {
        const roles = await this.context.find();
        return roles.map((role) => this.entityToModelMapper(role));
    }

    public async getRoleById(id: number): Promise<Role | null> {
        return await this.context.findOneBy({ roleId: id });
    }
}
