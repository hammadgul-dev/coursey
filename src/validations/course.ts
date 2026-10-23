import {z} from "zod"

export let idSchema = z
  .string()
  .trim()
  .min(1, "Invalid Id")
  .max(60, "Invalid Id")

let levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as any

export let courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title Must Be At Least 3 Characters")
    .max(120, "Title Is Too Long"),
  description: z
    .string()
    .trim()
    .min(20, "Description Must Be At Least 20 Characters")
    .max(2000, "Description Is Too Long"),
  category: z
    .string()
    .trim()
    .min(2, "Category Is Required")
    .max(50, "Category Is Too Long"),
  level: z.enum(levels, {message: "Choose A Valid Level"}),
  cover: z
    .string()
    .trim()
    .url("Cover Must Be A Valid Url")
    .max(500, "Cover Url Is Too Long")
    .optional()
    .or(z.literal("")),
  learn: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Learning Point Is Empty")
        .max(200, "Learning Point Is Too Long"),
    )
    .max(10, "Maximum 10 Learning Points")
    .default([]),
})

export let courseUpdateSchema = courseSchema.partial()

export let moduleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Module Title Must Be At Least 2 Characters")
    .max(120, "Module Title Is Too Long"),
})

export let lessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Lesson Title Must Be At Least 2 Characters")
    .max(120, "Lesson Title Is Too Long"),
  content: z.string().max(50000, "Lesson Content Is Too Long").default(""),
  readMinutes: z.coerce
    .number()
    .int("Read Time Must Be A Whole Number")
    .min(1, "Read Time Must Be At Least 1 Minute")
    .max(600, "Read Time Is Too Long")
    .default(1),
  isFree: z.boolean().default(false),
})

export let lessonUpdateSchema = lessonSchema.partial()

export let checkpointSchema = z.object({
  question: z
    .string()
    .trim()
    .min(3, "Question Must Be At Least 3 Characters")
    .max(500, "Question Is Too Long"),
  answer: z
    .string()
    .trim()
    .min(1, "Answer Is Required")
    .max(1000, "Answer Is Too Long"),
})

export let checkpointUpdateSchema = checkpointSchema.partial()

export let reorderSchema = z.object({
  ids: z
    .array(idSchema)
    .min(1, "Nothing To Reorder")
    .max(200, "Too Many Items"),
})

export let rejectSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Reason Must Be At Least 5 Characters")
    .max(500, "Reason Is Too Long"),
})

export let courseQuerySchema = z.object({
  search: z.string().trim().max(100, "Search Is Too Long").optional(),
  category: z.string().trim().max(50, "Category Is Too Long").optional(),
  level: z.enum(levels, {message: "Choose A Valid Level"}).optional(),
  maxRead: z.coerce.number().int().min(1).max(10000).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
})
