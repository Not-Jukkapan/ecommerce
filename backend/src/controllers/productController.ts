import { NextFunction, Request, Response } from "express"
import { prismaClient } from ".."
import { NotFoundException } from "../exceptions/not-found"
import { ErrorCodes } from "../exceptions/root"

export const createProduct = async (req: Request, res: Response) => {
    // our tags ["tea","india"] => "tea,india"
    // Create a validator to this request
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product)
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = req.body
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const updateProduct = await prismaClient.product.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: product
        })
        res.json(updateProduct)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }

}
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const deleteProduct = await prismaClient.product.delete({
            where: {
                id: parseInt(req.params.id)
            },

        })
        res.json(deleteProduct)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }
}
export const listProducts = async (req: Request, res: Response) => {
    // For pagination like 
    //{ "offset": 0,count: 100}
    //     "limit": 10,}

    const count = await prismaClient.product.count()
    const products = await prismaClient.product.findMany({
        skip: +req.query.skip! | 0,
        take: +req.query.limit! | 10
    })
    res.json({ count, products })

}
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaClient.product.findUnique({
            where:{
                id:parseInt(req.params.id)
            }
        })
        res.json(product)
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }
}