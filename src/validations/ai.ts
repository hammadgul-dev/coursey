import {z} from "zod"

let levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as any

export let checkpointSuggestInputSchema = z.object({
  count: z
    .number()
    .int()
    .min(1, "Invalid Count")
    .max(5, "Invalid Count")
    .default(3),
})

export let checkpointSuggestOutputSchema = z.object({
  checkpoints: z
    .array(
      z.object({
        question: z.string().trim().min(3).max(500),
        answer: z.string().trim().min(1).max(1000),
      }),
    )
    .min(1)
    .max(5),
})

export let draftOutputSchema = z.object({
  mismatch: z.boolean().optional(),
  content: z.string().trim().max(20000).optional(),
})

export let descriptionOutputSchema = z.object({
  mismatch: z.boolean().optional(),
  description: z.string().trim().max(2000).optional(),
})

export let learnOutputSchema = z.object({
  mismatch: z.boolean().optional(),
  learn: z.array(z.string().trim().min(3).max(200)).max(8).optional(),
})

export let outlineInputSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(3, "Topic Must Be At Least 3 Characters")
    .max(120, "Topic Is Too Long"),
  level: z.enum(levels, {message: "Choose A Valid Level"}),
  audience: z
    .string()
    .trim()
    .max(120, "Audience Is Too Long")
    .optional()
    .or(z.literal("")),
})

let outlineModulesSchema = z
  .array(
    z.object({
      title: z.string().trim().min(2).max(120),
      lessons: z
        .array(
          z.object({
            title: z.string().trim().min(2).max(120),
            description: z.string().trim().min(10).max(500),
          }),
        )
        .min(1)
        .max(6),
    }),
  )
  .min(1)
  .max(8)

export let outlineOutputSchema = z.object({
  mismatch: z.boolean().optional(),
  modules: outlineModulesSchema.optional(),
})

export let outlineApplySchema = z.object({
  modules: outlineModulesSchema,
})

export let reviewOutputSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string().trim().min(3).max(600),
  strengths: z.array(z.string().trim().min(3).max(400)).max(8),
  issues: z.array(z.string().trim().min(3).max(400)).max(8),
  suggestions: z.array(z.string().trim().min(3).max(400)).max(8),
})

export let scoreOutputSchema = z.object({
  score: z.number().min(0).max(100),
  note: z.string().trim().min(3).max(600),
  strengths: z.array(z.string().trim().min(3).max(400)).max(8),
  issues: z.array(z.string().trim().min(3).max(400)).max(8),
})
