import { Request, Response, NextFunction } from "express";
import { AddressSchema, UpdateUsersSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Address, User } from "@prisma/client";
import { prismaClient } from "..";
import { UpdateProductSchema } from "../schema/product";
import { BadRequest } from "../exceptions/bad-request";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body);
    let user: User;
    try {
        user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: +req.body.userId
            }
        });
    } catch (error) {
        throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND);
    }

    const address = await prismaClient.address.create({
        data: { ...req.body, userId: user.id }
    })
    res.json({ address })
}
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({ where: { id: +req.params.id } });

        res.json({ success: true });
    } catch (error) {
        throw new NotFoundException("Address not found", ErrorCodes.ADDRESS_NOT_FOUND);
    }
}
export const listAddress = async (req: Request, res: Response) => {

    const addresses = await prismaClient.address.findMany({
        where: {
            userId: +req.body.userId
        }
    })
    res.json({ addresses })
}

export const updateAddress = async (req: Request, res: Response) => {
    const validateData = UpdateUsersSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;
    if (validateData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: +validateData.defaultShippingAddress
                }
            });

        } catch (error) {
            throw new NotFoundException("Address not found", ErrorCodes.ADDRESS_NOT_FOUND);

        }
        if (shippingAddress.userId !== +req.body.userId) {
            throw new BadRequest("Address does not belong to user.", ErrorCodes.ADDRESS_DOES_NOT_BELONG);
        }
    }

    if (validateData.defaultBillingAddress) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: +validateData.defaultBillingAddress
                }
            });

        } catch (error) {
            throw new NotFoundException("Address not found", ErrorCodes.ADDRESS_NOT_FOUND);
        }
        if (billingAddress.userId !== +req.body.userId) {
            throw new BadRequest("Address does not belong to user.", ErrorCodes.ADDRESS_DOES_NOT_BELONG);
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: +req.body.userId
        },
        data: {
            defaultShippingAddress: validateData.defaultShippingAddress,
            defaultBillingAddress: validateData.defaultBillingAddress
        }
    })

    res.json({ user: updatedUser })
}