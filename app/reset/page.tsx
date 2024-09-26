import { ResetPage } from "@/components/ui/reset"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
	title: "reset password | thispage",
	openGraph: {
		title: "reset password | thispage",
	},
}

interface Props {
	searchParams: {
		error?: string
		error_code?: string
		error_description?: string
		message?: string
	}
}

export default function Reset({ searchParams }: Props) {
	return <ResetPage searchParams={searchParams} />
}
