"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { loginFormSchema } from "@/utils/zod"

export async function signUp(values: z.infer<typeof loginFormSchema>) {
	const origin = headers().get("origin")
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
			emailRedirectTo: `${origin}/auth/callback`,
		},
	})

	if (error) {
		return redirect("/login?message=could not authenticate user")
	}

	revalidatePath("/login")
	return redirect("/?message=check email to continue sign in process")
}
