import { z } from "zod"

export const addPollItemFormSchema = z.object({
	book: z.string({ required_error: "book selection is required" }).min(1, "book selection is required"),
})
