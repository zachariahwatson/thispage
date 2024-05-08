import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Index() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect("/login")
	}

	console.log(user)

	return <>hi {user.user_metadata.name}</>
}
