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
		// Make sure next is just the path (without origin)
		if (next) {
			const nextUrl = new URL(next, referer) // This will parse the next param
			redirectTo += `?next=${nextUrl.pathname}${nextUrl.search}` // Only use the path + query part
		}
	}
	const supabase = createClient()

	const { error, data } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: redirectTo,
		},
	})

	if (error) {
		if (referer) {
			const refUrl = new URL(referer)
			const next = refUrl.searchParams.get("redirect")
			if (next) {
				return redirect(`/login?message=failed to sign in with google&type=error?redirect=${next}`)
			}
		}
		return redirect("/login?message=failed to sign in with google&type=error")
	}

	revalidatePath(data.url, "layout")
	return redirect(data.url)
}
