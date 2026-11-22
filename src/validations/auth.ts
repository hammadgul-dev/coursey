import {z} from "zod"
import {emailSchema} from "@/validations/email"

export let passwordRule = z
  .string()
  .min(8, "Password Must Be At Least 8 Characters")
  .max(72, "Password Is Too Long")

export let signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name Must Be At Least 2 Characters")
    .max(60, "Name Is Too Long"),
  email: emailSchema,
  password: passwordRule,
  role: z.enum(["STUDENT", "INSTRUCTOR"], {message: "Choose A Valid Role"}),
})

export let forgotSchema = z.object({
  email: emailSchema,
})

export let resetSchema = z.object({
  token: z
    .string()
    .length(64, "Invalid Or Expired Link")
    .regex(/^[a-f0-9]+$/, "Invalid Or Expired Link"),
  password: passwordRule,
})
