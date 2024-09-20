"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"
import { passwordResetRequestFormSchema } from "@/lib/zod"
import { revalidatePath } from "next/cache"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export async function resetRequest(values: z.infer<typeof passwordResetRequestFormSchema>) {
	const email = values.email as string
	const supabase = createClient()

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${defaultUrl}/reset`,
	})

	if (error) {
		let message = `could not send recovery email :( code: ${error.code}`

		if (error.name === "AuthApiError") {
			switch (error.code) {
				case "over_email_send_rate_limit":
					message = `you've had too many emails sent to you. please wait before trying again.`
					break
				case "over_request_rate_limit":
					message = "too many requests have been sent from your client. please wait before trying again."
					break
			}
		}

		return redirect(`/login?message=${message}&type=error`)
	}

	revalidatePath("/login", "layout")
	return redirect("/login?message=check your email to continue the password reset process! :)")
}
