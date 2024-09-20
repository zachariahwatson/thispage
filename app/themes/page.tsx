import { ThemeToolPage } from "@/components/ui/themes"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "theme tool | thispage",
	openGraph: {
		title: "theme tool | thispage",
	},
}

export default function Page() {
	return <ThemeToolPage />
}
