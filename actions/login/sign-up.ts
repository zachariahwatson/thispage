"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { signUpFormSchema } from "@/lib/zod"

export async function signUp(values: z.infer<typeof signUpFormSchema>) {
	const origin = headers().get("origin")
	let redirectTo = `${origin}/auth/callback`
	const referer = headers().get("referer")
	if (referer) {
		const refUrl = new URL(referer)
		const next = refUrl.searchParams.get("redirect")
		redirectTo += `?next=${next}`
	}
	const firstName = values.firstName as string
	const lastName = values.lastName as string
	const email = values.email as string
	const password = values.password as string
	const supabase = createClient()

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				name: `${firstName} ${lastName}`,
			},
			emailRedirectTo: redirectTo,
		},
	})

	if (error) {
		if (referer) {
			const refUrl = new URL(referer)
			const next = refUrl.searchParams.get("redirect")
			if (next) {
				return redirect(`/login?message=could not create user&type=error?redirect=${next}`)
			}
		}
		return redirect("/login?message=could not create user&type=error")
	}

	revalidatePath("/login", "layout")
	return redirect("/login?message=check email to continue the sign up process")
}
