import { z } from "zod"

export const addPollFormSchema = z.object({
	name: z
		.string({ required_error: "name is required" })
		.max(50, "name must contain no more than 50 characters")
		.min(1, "name is required"),
	description: z.string().max(250, "description must contain no more than 250 characters").optional(),
	endDate: z.string({ required_error: "end date is required" }).date(),
	isLocked: z.boolean().default(false),
})
