import { z } from "zod"

export const signInFormSchema = z.object({
	email: z.string().email("invalid email format"),
	password: z
		.string()
		.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/, "Invalid password format"),
})
