import { z } from "zod"

export const signInFormSchema = z.object({
	email: z.string({ required_error: "email is requred" }).email("invalid email format"),
	password: z.string({ required_error: "password is requred" }),
})
