import UserContext from "../../data-access/UserContext";
import { User } from "../../entities/User";
import {
    CreateUserModel,
    LoggedInUserModel,
    LoginModel,
    UserGridModel,
} from "../data-models/User";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import HttpError from "../../lib/error/error";
import BaseManager from "./BaseManager";
import RoleManager from "./RoleManager";
import { RoleEnum } from "../../entities/Role";

export class UserManager extends BaseManager<UserContext, User, UserGridModel> {

    private currentUser: LoggedInUserModel;

    public entityToModelMapper(entity: User): UserGridModel {
        return {
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            username: entity.username,
            number: entity.number,
        };
    }

    constructor(user?: LoggedInUserModel) {
        super();
        this.context = new UserContext();
        if(user) this.currentUser = user
    }

    public async findById(userId: string) {
        if ( this.currentUser.roleId === RoleEnum.ADMIN || (this.currentUser.roleId === RoleEnum.USER && this.currentUser.id === userId)) {
            const result = await this.context.findOneBy({ id: userId });
            if (!result)  throw new HttpError(`User with the id ${userId} not found!`, 404);
            return this.entityToModelMapper(result);
        }
        throw new HttpError("User is not authorized to view this page.", 403)
    }

    public async createUser(payload: CreateUserModel): Promise<UserGridModel> {
        const user = new User();
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.email = payload.email;
        user.username = payload.username;
        user.isActive = payload.isActive;
        user.number = payload.number;

        //assign default role
        let role;
        const roleManager = new RoleManager();
        if (payload.roleId) {
            role = await roleManager.getRoleById(payload.roleId);
            if (!role)
                throw new HttpError(
                    `Role for id ${payload.roleId} not found!`,
                    400
                );
        } else {
            //user role
            role = await roleManager.getRoleById(RoleEnum.USER);
            if (!role)
                throw new HttpError(
                    `Role for id ${payload.roleId} not found!`,
                    400
                );
        }
        user.role = role;
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(payload.password, salt);
        user.password = hashedPassword;

        const createdUser = await this.context.insert(user);
        return this.entityToModelMapper(createdUser);
    }

    public async getUsers(): Promise<UserGridModel[]> {
        if(this.currentUser.roleId !== RoleEnum.ADMIN) throw new HttpError("User is not authorized", 403)
        const result = await this.context.find();
        return result.map((r) => this.entityToModelMapper(r));
    }

    public async login(loginDetails: LoginModel) {
        if (!loginDetails.email || !loginDetails.password)
            throw new HttpError("Email and password is required.", 400);

        const result = await this.context.findByEmail(loginDetails.email);
        if (!result)
            throw new HttpError(
                `User not found for the email address ${loginDetails.email}`,
                404
            );

        const isValid = bcrypt.compareSync(
            loginDetails.password,
            result.password
        );

        if (!isValid)
            throw new HttpError(
                `Wrong password for ${loginDetails.email}`,
                401
            );

        const secret = process.env.SECRET_KEY as string;
        if (!secret)
            throw new HttpError(
                `Secret key for creating jwt token not found!`,
                500
            );

        const token = sign(
            {
                id: result.id,
                username: result.username,
                email: result?.email,
                roleId: result.role?.roleId
            },
            secret,
            { expiresIn: 3000 }
        );

        return {
            status: 200,
            message: "Login successful!",
            token,
        };
    }

    public async deleteUser(id: string): Promise<UserGridModel> {
        if(this.currentUser.roleId !== RoleEnum.ADMIN) throw new HttpError("User is not authorized", 403)
        if (!id) throw new HttpError("userId is required!", 400);
        const user = await this.context.findOneBy({ id: id });
        if (!user) throw new HttpError(`User not found! Id: ${id}`, 404);
        const deletedUser = await this.context.remove(user);
        return this.entityToModelMapper(deletedUser);
    }
}
