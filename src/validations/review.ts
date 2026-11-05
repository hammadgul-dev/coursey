import {z} from "zod"

export let reviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
})
