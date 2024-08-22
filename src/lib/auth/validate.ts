import { verify } from "jsonwebtoken";

export const validateToken = (token: string | undefined | null, res: any) => {
    
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
    const user = verify(token, secret);
    if (!user) {
        return res.send({
            status: 400,
            message: `Invalid or missing token`,
        });
    }
    return user;
};
