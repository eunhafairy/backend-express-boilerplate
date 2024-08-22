import { Role } from "../entities/Role";
import Context from "./BaseContext";

export default class RoleContext extends Context<Role> {
    constructor() {
        super();
        this.entity = Role;
    }
}
