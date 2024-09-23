import { NextFunction, Request, Response } from "express";
import { UnauthirizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
    user?: User
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. extract the token from the request header
    const token = req.headers.authorization;
    // 2. if token not present, thorw an error of unautorized
    if (!token) {
        // ใช้ next ไม่ใช่ thorw เพราะว่าเราใช้ middleware ไม่ได้ wrap มันด้วย error handler ที่เราสร้างไว้
        next(new UnauthirizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    }
    try {
        // 3. if token is present, verify the token and extract the payload
        const payload: {userId:number} = jwt.verify(token!, JWT_SECRET) as any;
        // 4. to get the user from the payload
        const user = await prismaClient.user.findUnique({ where: { id: payload.userId } }) as User;
        if(!user){
            next(new UnauthirizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
        }
        // 5. to attact the user to the current request object.
        req.user = user;
        next();
        
    } catch (error: any) {
        next(new UnauthirizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    }

}
export default authMiddleware;