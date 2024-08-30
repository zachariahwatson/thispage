import { z } from "zod"

export const editReadingFormSchemaPages = z.object({
	bookCoverImageURL: z.string().url({ message: "invalid url" }).optional(),
	// startDate: z.string().date().optional(),
	intervalPageLength: z
		.string()
		.refine(
			(val) => {
				if (val.trim() === "") {
					return false // Empty strings should be invalid
				}
				const num = Number(val)
				return !isNaN(num) && num > 0
			},
			{
				message: "goal page increment amount must be a valid number greater than zero.",
			}
		)
		.optional(),
	joinInProgress: z.boolean(),
})