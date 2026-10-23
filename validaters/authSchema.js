import {z} from 'zod/v4';

export const loginSchema = z.object({
    email : z.email("enter a valid email"),
    password : z.string().min(6),
})


export const signupSchema = loginSchema.extend({
    name : z.string().min(3).max(100)
})

export const otpSchema = z.object({
    email : z.email("enter a valid email"),
    otp : z.string().min(4).max(4)
})