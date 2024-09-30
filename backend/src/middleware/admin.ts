import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { UnauthirizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import { AuthenticatedRequest } from "./auth";


export const adminMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user
    if (user?.role == "ADMIN") {
        next()
    } else {
        next(new UnauthirizedException("Unauthorized", ErrorCodes.UNAUTHORIZED));
    }
}

export default adminMiddleware;