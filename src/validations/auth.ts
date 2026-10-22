import {z} from "zod"

export let signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name Must Be At Least 2 Characters")
    .max(60, "Name Is Too Long"),
  email: z.string().trim().toLowerCase().email("Enter A Valid Email"),
  password: z
    .string()
    .min(8, "Password Must Be At Least 8 Characters")
    .max(72, "Password Is Too Long"),
  role: z.enum(["STUDENT", "INSTRUCTOR"], {message: "Choose A Valid Role"}),
})
