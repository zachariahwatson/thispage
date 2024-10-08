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
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while signing in with google:\n", error)

		if (referer) {
			const refUrl = new URL(referer)
			const next = refUrl.searchParams.get("redirect")
			if (next) {
				return redirect(
					`/login?error=${error.status}&error_code=${error.code}&error_description=failed to sign in with google :(&redirect=${next}`
				)
			}
		}
		return redirect(
			`/login?error=${error.status}&error_code=${error.code}&error_description=failed to sign in with google :(`
		)
	}

	revalidatePath(data.url, "layout")
	return redirect(data.url)
}
