import { ResetPage } from "@/components/ui/reset"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "reset password | thispage",
	openGraph: {
		title: "reset password | thispage",
	},
}

export default function Reset() {
	return <ResetPage />
}
