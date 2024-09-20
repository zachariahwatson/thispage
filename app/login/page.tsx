import { LoginPage } from "@/components/ui/login"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "login | thispage",
	openGraph: {
		title: "login | thispage",
	},
}

interface Props {
	searchParams: { message?: string; type?: string; redirect: string }
}

export default function Login({ searchParams }: Props) {
	return <LoginPage searchParams={searchParams} />
}
