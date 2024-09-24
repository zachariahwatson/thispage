"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { signUpFormSchema } from "@/lib/zod"
import { AuthApiError } from "@supabase/supabase-js"

export async function signUp(values: z.infer<typeof signUpFormSchema>) {
	let redirectTo = "/"
	const referer = headers().get("referer")
	if (referer) {
		const refUrl = new URL(referer)
		const next = refUrl.searchParams.get("redirect") ?? "/"
		redirectTo = next
	}
	const firstName = values.firstName as string
	const lastName = values.lastName as string
	const email = values.email as string
	const password = values.password as string
	const acceptTerms = values.acceptTerms as boolean
	if (!acceptTerms) {
		throw new AuthApiError("user did not accept terms and conditions", 403, "terms_and_conditions_not_accepted")
	}

	const supabase = createClient()

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				first_name: firstName,
				last_name: lastName,
				name: `${firstName} ${lastName}`,
			},
			emailRedirectTo: redirectTo,
		},
	})

	if (error) {
		let errorDescription = `could not create user :(`

		if (error.name === "AuthApiError") {
			switch (error.code) {
				case "user_already_exists":
					errorDescription = "user already exists"
					break
				case "email_exists":
					errorDescription = "email already exists in the system"
					break
				case "over_email_send_rate_limit":
					errorDescription = `you've had too many emails sent to you. please wait before trying again.`
					break
				case "over_request_rate_limit":
					errorDescription = "too many requests have been sent from your client. please wait before trying again."
					break
			}
		}

		if (referer) {
			const refUrl = new URL(referer)
			const next = refUrl.searchParams.get("redirect")
			if (next) {
				return redirect(
					`/login?error=${error.status}&error_code=${error.code}&error_description=${errorDescription}&redirect=${next}`
				)
			}
		}
		return redirect(`/login?error=${error.status}&error_code=${error.code}&error_description=${errorDescription}`)
	}

	revalidatePath("/login", "layout")
	return redirect("/login?message=check your email to continue the sign up process! :)")
}
