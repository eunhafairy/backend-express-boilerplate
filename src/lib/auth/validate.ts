import { verify } from "jsonwebtoken";
import HttpError from "../error/error";
import { LoggedInUserModel } from "../../business-logic/data-models/User";

export const validateToken = (token: string | undefined | null): LoggedInUserModel => {
    if (!token) throw new HttpError(`Invalid or missing token`, 401);

    const secret = process.env.SECRET_KEY as string;
    if (!secret)  throw new HttpError(`Secret key for creating jwt token not found!`, 500);

    const user = verify(token, secret);
    if (!user) throw new HttpError(`Invalid or missing token`, 401);
    return user as LoggedInUserModel;
};
