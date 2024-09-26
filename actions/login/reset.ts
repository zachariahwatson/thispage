"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { passwordResetFormSchema } from "@/lib/zod"

export async function reset(values: z.infer<typeof passwordResetFormSchema>) {
	const referer = headers().get("referer")
	const password = values.password as string
	const supabase = createClient()

	const { data, error } = await supabase.auth.updateUser({
		password: password,
	})

	if (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while resetting password:\n", error)

		let errorDescription = `could not reset password :(`

		if (error.name === "AuthApiError") {
			switch (error.code) {
				case "over_request_rate_limit":
					errorDescription = "too many requests have been sent from your client. please wait before trying again."
					break
			}
		}

		if (error.name === "AuthSessionMissingError") {
			switch (error.status) {
				case 400:
					errorDescription = "the session is missing, please use a valid reset link."
					break
			}
		}

		if (referer) {
			const refUrl = new URL(referer)
			return redirect(
				`/reset?error=${error.status}&error_code=${error.code}&error_description=${errorDescription}&${refUrl.search}`
			)
		}
		return redirect(`/reset?error=${error.status}&error_code=${error.code}&error_description=${errorDescription}`)
	}

	if (data) {
		revalidatePath("/login", "layout")
		return redirect("/login?message=password reset completed! :)")
	}
}
