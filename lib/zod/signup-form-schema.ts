import { z } from "zod"

export const signUpFormSchema = z
	.object({
		firstName: z
			.string()
			.max(50, "first name must contain no more than 50 characters")
			.regex(/^[A-Za-z'-]*$/, "invalid first name format"),
		lastName: z
			.string()
			.max(50, "last name must contain no more than 50 characters")
			.regex(/^[A-Za-z'-]*$/, "invalid last name format"),
		email: z.string({ required_error: "email is required" }).email("invalid email format").min(1, "email is required"),
		password: z
			.string({ required_error: "password is required" })
			.regex(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
				"password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character."
			),
		confirmPassword: z
			.string({ required_error: "comfirm password is required" })
			.regex(
				/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
				"password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character."
			),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "passwords don't match",
		path: ["confirmPassword"],
	})
