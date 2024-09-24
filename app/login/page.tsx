import { LoginPage } from "@/components/ui/login"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "login | thispage",
	openGraph: {
		title: "login | thispage",
	},
}

export default function Login() {
	return <LoginPage />
}
