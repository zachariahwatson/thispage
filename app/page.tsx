import { createClient } from "@/utils/supabase/server"
import { ClubBooks } from "@/components/ui/books/club"
import { DemoSpreads } from "@/components/ui/books/demo"
import { Card, WhatsNewDialog } from "@/components/ui"
import Link from "next/link"
import { FirstLoadAnimationProvider } from "@/contexts"

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
		<FirstLoadAnimationProvider key="demo">
			<div className="max-w-sm md:max-w-4xl w-full space-y-3 relative">
				<div>
					<h1 className="font-bold text-lg md:text-3xl pl-1 truncate ... font-epilogue">
						welcome to <span className="font-normal">this</span>
						<span className="font-bold">page</span>!
					</h1>
					<h1 className="text-lg md:text-3xl pl-1 truncate ... font-epilogue">a simple site for book clubs.</h1>
				</div>
				<DemoSpreads />
				<h1 className="text-md md:text-2xl pl-1 truncate ... float-right font-epilogue">
					<Link href="/login" className="underline text-primary">
						login
					</Link>{" "}
					and start book clubbing!
				</h1>
			</div>
		</FirstLoadAnimationProvider>
	)
}
