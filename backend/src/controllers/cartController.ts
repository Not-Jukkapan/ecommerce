import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { AuthenticatedRequest } from "../middleware/auth";



export const addItemCart = async (req: AuthenticatedRequest, res: Response) => {
    // Check for the existence of the same product in user's cart and alter the quantity as required
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        });

    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND);
    }
    const cart = await prismaClient.cartItem.create({
        data: {
            userId: req.user!.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    })
    res.json(cart);
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    // check if user delete his own cart item
    await prismaClient.cartItem.delete({ where: { id: +req.params.id } });
    res.json({ success: true });
}

export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = ChangeQuantitySchema.parse(req.body);
    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })

    res.json(updatedCart);
}

export const getCart = async (req: Request, res: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: (req as AuthenticatedRequest).user!.id
        },
        include: {
            product: true
        }
    });
    res.json(cart);
}