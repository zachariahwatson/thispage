import { DemoPage2 } from "@/components/ui/books/demo"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "a demo post | thispage",
	description: "join thispage now!",
	openGraph: {
		title: "a demo post | thispage",
		description: "join thispage now!",
	},
}

export default function Page() {
	return <DemoPage2 />
}
