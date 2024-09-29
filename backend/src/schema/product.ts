import {z} from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(0),
    price: z.number().min(1),
    tags: z.array(z.string())
})

export const UpdateProductSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(0).optional(),
    price: z.number().min(1).optional(),
    tags: z.array(z.string()).optional()
})