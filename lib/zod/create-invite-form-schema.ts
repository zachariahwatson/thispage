import { z } from "zod"

export const createInviteFormSchema = z.object({
	uses: z.string({ required_error: "uses is required" }).refine(
		(val) => {
			if (val.trim() === "") {
				return false // Empty strings should be invalid
			}
			const num = Number(val)
			return !isNaN(num) && num > 0
		},
		{
			message: "uses must be a valid number greater than zero.",
		}
	),
	expirationDate: z.string({ required_error: "expiration date is required" }).date(),
})
