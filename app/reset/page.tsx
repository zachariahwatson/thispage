import { ResetPage } from "@/components/ui/reset"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
	title: "reset password | thispage",
	openGraph: {
		title: "reset password | thispage",
	},
}

export default function Reset() {
	return (
		<Suspense>
			<ResetPage />
		</Suspense>
	)
}
