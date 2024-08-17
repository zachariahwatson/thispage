import { z } from "zod"

export const editPostFormSchema = z.object({
	content: z.string().max(1000, "content must contain no more than 1000 characters").optional(),
	isSpoiler: z.boolean().default(false),
})
