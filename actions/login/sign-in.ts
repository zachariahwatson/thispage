"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { loginFormSchema } from "@/utils/zod"

export async function signIn(values: z.infer<typeof loginFormSchema>) {
	const origin = headers().get("origin")
	const email = values.email as string
	const password = values.password as string
	const supabase = createClient()

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		return redirect("/login?message=could not authenticate user")
	}

	return redirect(`${origin}`)
}
