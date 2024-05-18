"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
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
		return redirect("/login?message=failed to sign in with google&type=error")
	}

	revalidatePath(data.url, "layout")
	return redirect(data.url)
}
