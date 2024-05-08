import { z } from "zod"

export const loginFormSchema = z
	.object({
		firstName: z
			.string()
			.max(50, "first name must contain no more than 50 characters")
			.regex(/^[A-Za-z'-]+$/, "Invalid first name format")
			.optional(),
		lastName: z
			.string()
			.max(50, "last name must contain no more than 50 characters")
			.regex(/^[A-Za-z'-]+$/, "Invalid last name format")
			.optional(),
		email: z.string().email("invalid email format"),
		password: z
			.string()
			.min(8, "password must contain at least 8 characters")
			.regex(/^[A-Za-z0-9!@#$%^&*()_+=[\]{}|;:'",.<>/?]+$/, "Invalid password format"),
		confirmPassword: z
			.string()
			.min(8, "confirm password must match the password")
			.regex(/^[A-Za-z0-9!@#$%^&*()_+=[\]{}|;:'",.<>/?]+$/, "Invalid password format"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	})
