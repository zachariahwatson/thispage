"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function signInWithGoogle() {
	const origin = headers().get("origin")
	let redirectTo = `${origin}/auth/callback`
	const referer = headers().get("referer")
	if (referer) {
		const refUrl = new URL(referer)
		const next = refUrl.searchParams.get("redirect")
		redirectTo += `?next=${next}`
	}
	const supabase = createClient()

	const { error, data } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: redirectTo,
		},
	})

	if (error) {
		return redirect("/login?message=failed to sign in with google&type=error")
	}

	revalidatePath(data.url, "layout")
	return redirect(data.url)
}
