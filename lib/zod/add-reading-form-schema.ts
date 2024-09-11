import { z } from "zod"

// export const addReadingFormSchema = z.object({
// 	book: z.string({ required_error: "book selection is required" }).min(1, "book selection is required"),
// 	bookCoverImageURL: z.string().url({ message: "invalid url" }).optional().or(z.literal("")),
// 	startDate: z.string({ required_error: "start date is required" }).date(),
// 	intervalPageLength: z
// 		.string()
// 		.refine(
// 			(val) => {
// 				if (val.trim() === "") {
// 					return false // Empty strings should be invalid
// 				}
// 				const num = Number(val)
// 				return !isNaN(num) && num > 0
// 			},
// 			{
// 				message: "goal page increment amount must be a valid number greater than zero.",
// 			}
// 		)
// 		.optional(),
// 	incrementType: z.enum(["pages", "sections"]),
// 	bookSections: z
// 		.string()
// 		.refine(
// 			(val) => {
// 				if (val.trim() === "") {
// 					return false // Empty strings should be invalid
// 				}
// 				const num = Number(val)
// 				return !isNaN(num) && num > 0
// 			},
// 			{
// 				message: "section count must be a valid number greater than zero.",
// 			}
// 		)
// 		.optional()
// 		.default(""),
// 	intervalSectionLength: z
// 		.string()
// 		.refine(
// 			(val) => {
// 				if (val.trim() === "") {
// 					return false // Empty strings should be invalid
// 				}
// 				const num = Number(val)
// 				return !isNaN(num) && num > 0
// 			},
// 			{
// 				message: "goal section increment amount must be a valid number greater than zero.",
// 			}
// 		)
// 		.optional(),
// 	sectionName: z.string().max(10, "name must contain no more than 10 characters").optional(),
// 	joinInProgress: z.boolean().default(true),
// })

const baseSchema = z.object({
	book: z.string({ required_error: "book selection is required" }).min(1, "book selection is required"),
	startDate: z.string({ required_error: "start date is required" }).date(),
	joinInProgress: z.boolean().default(true),
})

const pagesSchema = z.object({
	incrementType: z.literal("pages").optional(),
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
})

const sectionsSchema = z.object({
	incrementType: z.literal("sections"),
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
		.default(""),
	intervalSectionLength: z.string().refine(
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
	),
	sectionName: z.string().max(10, "name must contain no more than 10 characters").optional(),
})

export const addReadingFormSchema = z.discriminatedUnion("incrementType", [pagesSchema, sectionsSchema]).and(baseSchema)
