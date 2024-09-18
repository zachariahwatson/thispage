import { createClient } from "@/utils/supabase/server"
import { ClubBooks } from "@/components/ui/books/club"
import { DemoSpreads } from "@/components/ui/demo"
import { Card, WhatsNewDialog } from "@/components/ui"
import Link from "next/link"

export default async function Page() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	return user ? (
		<>
			<ClubBooks />
			<WhatsNewDialog />
		</>
	) : (
		<div className="max-w-sm md:max-w-4xl w-full space-y-3">
			<div>
				<h1 className="font-bold text-lg md:text-3xl pl-1 truncate ...">
					welcome to <span className="font-normal">this</span>
					<span className="font-bold">page</span>!
				</h1>
				<h1 className="text-lg md:text-3xl pl-1 truncate ...">a simple site for book clubs.</h1>
			</div>
			<Card className="h-[calc(100svh-56px)] min-h-[624px] md:h-[624px] p-4 rounded-3xl relative shadow-shadow shadow-sm bg-book border-book-border">
				<DemoSpreads />
			</Card>
			<h1 className="text-md md:text-2xl pl-1 truncate ... float-right">
				<Link href="/login" className="underline text-primary">
					login
				</Link>{" "}
				and start book clubbing!
			</h1>
		</div>
	)
}
