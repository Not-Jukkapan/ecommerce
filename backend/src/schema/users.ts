import {z} from 'zod';

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1)
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})