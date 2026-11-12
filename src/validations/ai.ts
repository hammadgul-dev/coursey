import {z} from "zod"

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
