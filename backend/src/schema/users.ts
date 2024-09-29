import { z } from 'zod';

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1)
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export const AddressSchema = z.object({
    line: z.string().min(1),
    lineTwo: z.string().optional(),
    city: z.string().min(1),
    country: z.string().min(1),
    pincode: z.string().min(1),
    userId: z.number()
})
