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
const { sign, verify } = jwt;

route.get("/", async (req, res) => {
    try {
        //validate jwt
        const token = req.header("Authorization") as string;
        if (!token) {
            return res.send({
                status: 400,
                message: `Invalid or missing token`,
            });
        }
        const secret = process.env.SECRET_KEY as string;
        if (!secret) {
            return res.send({
                status: 500,
                message: `Secret key for creating jwt token not found!`,
            });
        }
        const isValid = verify(token, secret);
        if (!isValid) {
            return res.send({
                status: 400,
                message: `Invalid or missing token`,
            });
        }

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
        //Get User information from request body
        const payload: CreateUserModel = req.body;
        const user = new User();
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.email = payload.email;
        user.username = payload.username;
        user.isActive = payload.isActive;
        user.number = payload.number;

        //hash the password
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(payload.password, salt);
        user.password = hashedPassword;

        const userRespository = AppDataSource.getRepository(User);
        await userRespository.save(user);

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
