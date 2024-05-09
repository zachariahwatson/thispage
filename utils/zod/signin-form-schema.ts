import { z } from "zod"

export const signInFormSchema = z.object({
	email: z.string().email("invalid email format"),
	password: z
		.string()
		.min(8, "Invalid password format")
		.regex(/^[A-Za-z0-9!@#$%^&*()_+=[\]{}|;:'",.<>/?]+$/, "Invalid password format"),
})
