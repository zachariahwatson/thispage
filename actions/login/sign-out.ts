"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { toast } from "sonner"

export async function signOut() {
	const supabase = createClient()

	const { error } = await supabase.auth.signOut()

	if (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while signing out:\n", error)
	}

	return redirect("/")
}
