import express from "express";
import {
    CreateUserModel,
    LoginModel,
} from "../business-logic/data-models/user";
const route = express.Router();
import { validateToken } from "../lib/auth/validate";
import { UserManager } from "../business-logic/manager/UserManager";

route.get("/", async (req, res) => {
    try {
        //validate jwt
        const token = req.header("Authorization") as string;
        const loggedInUser = validateToken(token, res);
        console.log("Logged in user: ", loggedInUser?.email);

        const userManager = new UserManager();

        if (req.query.userId) {
            const userId = req.query.userId as string;
            const user = await userManager.findById(userId);

            return res.send({
                status: 200,
                data: user,
            });
        }

        const result = await userManager.getUsers();
        return res.send({
            status: 200,
            data: result,
        });
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
        const userManager = new UserManager();
        const result = await userManager.login(loginDetails, res);
        res.send(result);
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
        const userManager = new UserManager();
        await userManager.createUser(payload);

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
