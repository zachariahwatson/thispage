import { z } from "zod"

export const addPollFormSchema = z.object({
	name: z
		.string({ required_error: "name is required" })
		.max(50, "name must contain no more than 50 characters")
		.min(1, "name is required"),
	description: z.string().max(250, "description must contain no more than 250 characters").optional(),
	votingPeriodLength: z.string().refine(
		(val) => {
			if (val.trim() === "") {
				return false // Empty strings should be invalid
			}
			const num = Number(val)
			return !isNaN(num) && num > 0
		},
		{
			message: "voting period length should be a valid number greater than zero.",
		}
	),
	isLocked: z.boolean().default(false),
})
