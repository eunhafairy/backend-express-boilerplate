import UserContext from "../../data-access/UserContext";
import { User } from "../../entities/User";
import { CreateUserModel, LoginModel } from "../data-models/user";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import HttpError from "../../lib/error/error";

export class UserManager {
    private context: any;
    constructor() {
        this.context = new UserContext();
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

    public async getUsers(): Promise<User[]> {
        return await this.context.find();
    }

    public async login(loginDetails: LoginModel, res: any) {
        if (!loginDetails.email || !loginDetails.password)  throw new HttpError("Email and password is required.", 400)
        
        const result = await this.context.findByEmail(loginDetails.email);
        if (!result) throw new HttpError( `User not found for the email address ${loginDetails.email}`, 404)
        

        const isValid = bcrypt.compareSync(
            loginDetails.password,
            result.password
        );

        if (!isValid) throw new HttpError( `Wrong password for ${loginDetails.email}`, 401)
        

        const secret = process.env.SECRET_KEY as string;
        if (!secret) throw new HttpError(`Secret key for creating jwt token not found!`, 500)
        
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
