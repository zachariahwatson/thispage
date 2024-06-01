import { z } from "zod"

export const settingsFormSchema = z.object({
	firstName: z
		.string()
		.max(50, "first name must contain no more than 50 characters")
		.optional()
		.refine((val) => !val || /^[A-Za-z'-]+$/.test(val), {
			message: "Invalid first name format",
		}),
	lastName: z
		.string()
		.max(50, "last name must contain no more than 50 characters")
		.optional()
		.refine((val) => !val || /^[A-Za-z'-]+$/.test(val), {
			message: "Invalid last name format",
		}),
})
