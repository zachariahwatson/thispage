"use server"

import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { toast } from "sonner"

export async function signOut() {
	const supabase = createClient()

	const { error } = await supabase.auth.signOut()

	if (error) {
		toast.error("an error occurred while signing out")
	}

	return redirect("/")
}
