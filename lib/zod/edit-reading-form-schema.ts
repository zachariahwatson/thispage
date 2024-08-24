import { z } from "zod"

export const editReadingFormSchema = (bookSections: number) =>
	z.object({
		// startDate: z.string().date().optional(),
		intervalPageLength: z.string().refine(
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
		),
		bookSections: z
			.string()
			.refine(
				(val) => {
					if (val.trim() === "") {
						return false // Empty strings should be invalid
					}
					const num = Number(val)
					return !isNaN(num) && num >= bookSections
				},
				{
					message: "section count must be a valid number greater the current book section count.",
				}
			)
			.optional(),
		intervalSectionLength: z
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
					message: "goal section increment amount must be a valid number greater than zero.",
				}
			)
			.optional(),
		sectionName: z.string().max(10, "name must contain no more than 10 characters").optional(),
		joinInProgress: z.boolean(),
	})
