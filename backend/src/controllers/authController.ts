import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { BadRequest } from "../exceptions/bad-request";
import { ErrorCodes } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { Sign } from "crypto";
import { SignupSchema } from "../schema/users";

export const signup = async (req: Request, res: Response, next: NextFunction) => {

    try {
        SignupSchema.parse(req.body);
        const { email, password, name } = req.body;

        // check user exists
        let user = await prismaClient.user.findUnique({
            where: { email }
        });
        if (user) {
            next(new BadRequest('User already exists', ErrorCodes.USER_ALREADY_EXISTS))
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
    } catch (error: any) {
        next(new UnprocessableEntity(error?.issues, 'Unprocessable Entity', ErrorCodes.UNPROCESSABLE_ENTITY));
    }

}

export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    // check user exists
    let user = await prismaClient.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error('User does not exists');
    }

    if (!compareSync(password, user.password)) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({
        userId: user.id,
    }, JWT_SECRET)

    res.json({ user, token });
}