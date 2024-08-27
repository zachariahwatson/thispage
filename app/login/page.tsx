"use client"

import { SignInForm, SignUpForm } from "@/components/ui/forms/login"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
	searchParams: { message?: string; type?: string; redirect: string }
}

export default function Login({ searchParams }: Props) {
	const [formType, setFormType] = useState("signin")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [message, setMessage] = useState<string>("")
	const router = useRouter()
	const path = usePathname()

	useEffect(() => {
		if (searchParams.message) {
			if (searchParams.type === "error") {
				toast.error(`${searchParams.message}`)
			} else {
				setMessage(searchParams.message)
			}
		}
	}, [searchParams.message])

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			{searchParams.redirect && (
				<h1 className="w-full text-center font-medium text-2xl mb-4">log in to view that page ;)</h1>
			)}
			<h1 className="w-full text-center font-medium text-2xl mb-4">{message}</h1>
			{formType === "signin" ? (
				<SignInForm
					setFormType={setFormType}
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
				/>
			) : (
				<SignUpForm
					setFormType={setFormType}
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
				/>
			)}
		</div>
	)
}
