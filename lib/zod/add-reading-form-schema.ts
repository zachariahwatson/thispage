import { z } from "zod"

export const addReadingFormSchema = z
	.object({
		book: z.string({ required_error: "book selection is required" }).min(1, "book selection is required"),
		startDate: z.string({ required_error: "start date is required" }).date(),
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
		incrementType: z.enum(["pages", "sections"]),
		bookSections: z
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
					message: "section count must be a valid number greater than zero.",
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
		joinInProgress: z.boolean().default(true),
	})
	.refine(
		(data) => {
			if (data.incrementType === "sections") {
				return data.bookSections
			}
			return true
		},
		{
			message: "section count is required",
			path: ["bookSections"],
		}
	)
