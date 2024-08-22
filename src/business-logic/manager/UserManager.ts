import { EntityTarget } from "typeorm";
import UserContext from "../../data-access/UserContext";
import { User } from "../../entities/User";
import { CreateUserModel } from "../data-models/user";
import bcrypt from "bcryptjs";

export class UserManager {
    private context: any;
    constructor() {
        this.context = new UserContext();
    }

    public async createUser(payload: CreateUserModel): Promise<any> {
        const user = new User();
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.email = payload.email;
        user.username = payload.username;
        user.isActive = payload.isActive;
        user.number = payload.number;
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(payload.password, salt);
        user.password = hashedPassword;

        await this.context.insert(user);
    }
}
