import { z } from "zod"

export const passwordResetRequestFormSchema = z.object({
	email: z.string().email("invalid email format"),
})
