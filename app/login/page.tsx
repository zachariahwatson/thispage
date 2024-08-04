"use client"

import { SignInForm, SignUpForm } from "@/components/ui/login"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface Props {
	searchParams: { message?: string; type?: string; redirect: string }
}

export default function Login({ searchParams }: Props) {
	const [formType, setFormType] = useState("signin")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const router = useRouter()
	const path = usePathname()

	useEffect(() => {
		if (searchParams.message) {
			if (searchParams.type === "error") {
				toast.error(`${searchParams.message}`)
			} else {
				toast.warning(`${searchParams.message}`)
			}
		}
	}, [searchParams.message])

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			{searchParams.redirect && (
				<h1 className="w-full text-center font-medium text-2xl mb-4">log in to view that page ;)</h1>
			)}
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
