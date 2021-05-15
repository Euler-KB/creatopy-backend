import {UserInfo} from "./types";
import jwt from "jsonwebtoken";

const JWT_KEY : string = process.env.JWT_SECRET || "tvac2tvcszYbFHUe";
const JWT_ISSUER : string = process.env.JWT_ISSUER || "api.creatopy.com";

export type JwtOptions = {
    key?: string,
    issuer?: string
}

export const signJwt = (user : UserInfo , options?: JwtOptions) : string => {
    return jwt.sign({ id: user.id },options?.key || JWT_KEY , {
        issuer: options?.issuer || JWT_ISSUER,
        algorithm: 'HS256'
    });
};

export const verifyJwt = (token: string, options?: JwtOptions) : UserInfo | undefined => {

    try{
        const { id } = jwt.verify(token,options?.key || JWT_KEY,{
            issuer: options?.issuer || JWT_ISSUER
        });

        return { id };
    }
    catch (e) {
        console.error('Failed parsing or processing jwt',e);
    }
};
