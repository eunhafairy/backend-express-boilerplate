import UserContext from "../../data-access/UserContext";
import { User } from "../../entities/User";
import {
    CreateUserModel,
    LoginModel,
    UserGridModel,
} from "../data-models/user";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import HttpError from "../../lib/error/error";
import BaseManager from "./BaseManager";

export class UserManager extends BaseManager<UserContext, User, UserGridModel> {
    public entityToModelMapper(entity: User): UserGridModel {
        return {
            firstName: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            username: entity.username,
            number: entity.number,
        };
    }

    constructor() {
        super();
        this.context = new UserContext();
    }

    public async findById(userId: string) {
        const result = await this.context.findOneBy({ id: userId });
        if (!result)
            throw new HttpError(`User with the id ${userId} not found!`, 404);
        return this.entityToModelMapper(result);
    }

    public async createUser(payload: CreateUserModel): Promise<User> {
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

        return await this.context.insert(user);
    }

    public async getUsers(): Promise<UserGridModel[]> {
        const result = await this.context.find();
        return result.map((r) => this.entityToModelMapper(r));
    }

    public async login(loginDetails: LoginModel, res: any) {
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
                username: result.username,
                email: result?.email,
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
}
