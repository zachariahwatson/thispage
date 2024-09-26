import { LoginPage } from "@/components/ui/login"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
	title: "login | thispage",
	openGraph: {
		title: "login | thispage",
	},
}

interface Props {
	searchParams: {
		error?: string
		error_code?: string
		error_description?: string
		message?: string
		redirect?: string
	}
}

export default function Login({ searchParams }: Props) {
	return <LoginPage searchParams={searchParams} />
}
