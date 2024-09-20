import { ResetPage } from "@/components/ui/reset"
import { Metadata } from "next"

interface Props {
	searchParams: { message?: string; type?: string; redirect: string }
}

export const metadata: Metadata = {
	title: "reset password | thispage",
	openGraph: {
		title: "reset password | thispage",
	},
}

export default function Reset({ searchParams }: Props) {
	return <ResetPage searchParams={searchParams} />
}
