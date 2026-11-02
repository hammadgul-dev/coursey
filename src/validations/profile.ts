import {z} from "zod"

export let profileSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(2, "Name Must Be At Least 2 Characters")
    .max(50, "Name Must Be At Most 50 Characters")
    .optional(),
  headline: z
    .string()
    .trim()
    .max(100, "Headline Must Be At Most 100 Characters")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(500, "Bio Must Be At Most 500 Characters")
    .optional(),
})

export let passwordSchema = z.strictObject({
  currentPassword: z
    .string()
    .min(1, "Current Password Is Required")
    .max(72, "Invalid Password"),
  newPassword: z
    .string()
    .min(8, "Password Must Be At Least 8 Characters")
    .max(72, "Password Must Be At Most 72 Characters"),
})
