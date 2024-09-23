import { Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { BadRequest } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
import { LoginSchema, SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
import { AuthenticatedRequest } from "../middleware/auth";

export const signup = async (req: Request, res: Response) => {
    SignupSchema.parse(req.body);
    const { email, password, name } = req.body;

    // check user exists
    let user = await prismaClient.user.findUnique({
        where: { email }
    });
    if (user) {
        throw new BadRequest('User already exists', ErrorCodes.USER_ALREADY_EXISTS)
    }

    user = await prismaClient.user.create({
        data:
        {
            name,
            email,
            password: hashSync(password, 10)
        }
    })
    res.json(user);

}

export const login = async (req: Request, res: Response) => {

    LoginSchema.parse(req.body);
    const { email, password } = req.body;

    // check user exists
    let user = await prismaClient.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new NotFoundException('User does not exists', ErrorCodes.USER_NOT_FOUND);
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequest('Invalid password', ErrorCodes.INCORRECT_PASSWORD);
    }

    const token = jwt.sign({
        userId: user.id,
    }, JWT_SECRET)

    res.json({ user, token });
}

export const me = async (req: AuthenticatedRequest, res: Response) => {
    res.json(req.user);
}