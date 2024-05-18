import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { ClubBookSkeleton, ClubBooksSuspense } from "@/components/ui/book"
import { Suspense } from "react"

export default async function Page() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect("/login")
	}

	return (
		<Suspense
			fallback={
				<>
					<ClubBookSkeleton />
					<ClubBookSkeleton />
				</>
			}
		>
			<ClubBooksSuspense />
		</Suspense>
	)
}
