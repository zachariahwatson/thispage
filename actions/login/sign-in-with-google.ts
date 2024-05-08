"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function signInWithGoogle() {
	const origin = headers().get("origin")
	const supabase = createClient()

	const { error, data } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${origin}/auth/callback`,
		},
	})

	if (error) {
		return redirect("/login?message=could not sign in with Google")
	}

	return redirect(data.url)
}
