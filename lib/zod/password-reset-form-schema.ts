import { z } from "zod"

export const passwordResetFormSchema = z
	.object({
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
