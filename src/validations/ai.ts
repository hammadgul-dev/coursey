import {z} from "zod"

export let testOutputSchema = z.object({
  message: z.string().min(1).max(300),
})
