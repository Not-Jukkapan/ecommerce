import { Request, Response } from "express";
import { prismaClient } from "..";
import { AuthenticatedRequest } from "../middleware/auth";

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    // 1) Create Transaction
    // 2) List all cart Items and procedd if cart is not empty
    // 3) Calculate total amount
    // 4) fetch address of user 
    // 5) define computed field for formatted address on address model
    // 6) we will create an order and order products
    // 7) create order event
    return await prismaClient.$transaction(async (trx) => {
        const cartItems = await prismaClient.cartItem.findMany({
            where: {
                userId: +req.user!.id
            },
            include: {
                product: true
            }
        })
        if (cartItems.length === 0) {
            return res.status(400).json({
                message: 'Cart is empty'
            })
        }
        const price = cartItems.reduce((prev, curr) => {
            return prev + (curr.quantity * +curr.product.price)
        }, 0);

        const address = await trx.address.findFirst({
            where:{
                id: req.user?.defaultBillingAddress!
            }
        });

    })
}



export const listOrder = async (req: Request, res: Response) => {

}

export const cancelOrder = async (req: Request, res: Response) => {

}

export const getOrderById = async (req: Request, res: Response) => {

}