import { z } from "zod"

export const createPostFormSchema = z.object({
	title: z
		.string({ required_error: "title is required" })
		.max(150, "title must contain no more than 150 characters")
		.min(1, "title is required"),
	content: z.string().max(1000, "content must contain no more than 1000 characters").optional(),
	isSpoiler: z.boolean().default(false),
})
