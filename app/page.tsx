import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ClubBooks } from "@/components/ui/book"

export default async function Page() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect("/login")
	}

	return <ClubBooks />
}
