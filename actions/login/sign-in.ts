"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { signInFormSchema } from "@/lib/zod"
import { revalidatePath } from "next/cache"

export async function signIn(values: z.infer<typeof signInFormSchema>) {
	let redirectTo = "/"
	const referer = headers().get("referer")
	if (referer) {
		const refUrl = new URL(referer)
		const next = refUrl.searchParams.get("redirect") ?? "/"
		redirectTo = next
	}
	const email = values.email as string
	const password = values.password as string
	const supabase = createClient()

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		let message = `could not sign in :( code: ${error.code}`

		if (error.name === "AuthApiError") {
			switch (error.code) {
				case "email_not_confirmed":
					message = "your email is not confirmed. please confirm and try again."
					break
				case "invalid_credentials":
					message = "email or password incorrect"
					break
				case "over_request_rate_limit":
					message = "too many requests have been sent from your client. please wait before trying again."
					break
			}
		}

		if (referer) {
			const refUrl = new URL(referer)
			const next = refUrl.searchParams.get("redirect")
			if (next) {
				return redirect(`/login?message=${message}&type=error?redirect=${next}`)
			}
		}
		return redirect(`/login?message=${message}&type=error`)
	}

	revalidatePath(`${redirectTo}`, "layout")
	return redirect(`${redirectTo}`)
}
