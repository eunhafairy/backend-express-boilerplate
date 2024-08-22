import express from "express";
import { AppDataSource } from "../datasource";
import { User } from "../entities/User";
import {
    CreateUserModel,
    LoginModel,
} from "../business-logic/data-models/user";
const route = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateToken } from "../lib/auth/validate";
import { UserManager } from "../business-logic/manager/UserManager";
const { sign } = jwt;

route.get("/", async (req, res) => {
    try {
        //validate jwt
        const token = req.header("Authorization") as string;
        const loggedInUser = validateToken(token, res)
        console.log("Logged in user: ", loggedInUser?.email)
        const userRespository = AppDataSource.getRepository(User);
        const result = await userRespository.find();
        res.send(result);
    } catch (exception: any) {
        console.error("Something went wrong!", JSON.stringify(exception));
        const status = exception?.status || 500;
        const message = exception?.message || "Something went wrong";
        res.send({
            status,
            message,
        });
    }
});

route.post("/login", async (req, res) => {
    try {
        const loginDetails: LoginModel = req.body;

        if (!loginDetails.email || !loginDetails.password) {
            return res.send({
                status: 400,
                message: "Email and password is required.",
            });
        }

        const userRespository = AppDataSource.getRepository(User);
        const result = await userRespository.findOneBy({
            email: loginDetails.email,
        });

        if (!result) {
            return res.send({
                status: 404,
                message: `User not found for the email address ${loginDetails.email}`,
            });
        }

        const isValid = bcrypt.compareSync(
            loginDetails.password,
            result.password
        );

        if (isValid) {
            const secret = process.env.SECRET_KEY as string;
            if (!secret) {
                return res.send({
                    status: 500,
                    message: `Secret key for creating jwt token not found!`,
                });
            }
            const token = sign(
                {
                    username: result.username,
                    email: result?.email,
                },
                secret,
                { expiresIn: 3000 }
            );

            return res.send({
                status: 200,
                message: "Login successful!",
                token,
            });
        }
        res.send({
            status: 401,
            message: "Wrong password",
        });
    } catch (exception: any) {
        console.error("Something went wrong!", JSON.stringify(exception));
        const status = exception?.status || 500;
        const message = exception?.message || "Something went wrong";
        return res.send({
            status,
            message,
        });
    }
});

route.post("/add", async (req, res) => {
    try {
    
        const payload: CreateUserModel = req.body;
        const userManager = new UserManager()
        await userManager.createUser(payload)

        res.send({
            message: "User successfully created!",
            status: 200,
        });
    } catch (exception: any) {
        console.error(
            "There was an error while creating user!",
            JSON.stringify(exception)
        );
        const status = exception?.status || 500;
        const message = exception?.message || "Something went wrong";
        res.send({
            status,
            message,
        });
    }
});
export default route;
