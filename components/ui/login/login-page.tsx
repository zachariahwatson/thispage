"use client"

import { PasswordResetRequestForm, SignInForm, SignUpForm } from "@/components/ui/forms/login"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
	searchParams: { message?: string; type?: string; redirect: string }
}

export function LoginPage({ searchParams }: Props) {
	const [formType, setFormType] = useState<string>("signin")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [message, setMessage] = useState<string>("")

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
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 pb-16">
			{searchParams.redirect && (
				<h1 className="w-full text-center font-medium text-2xl mb-4 font-epilogue">log in to view that page ;)</h1>
			)}
			<h1 className="w-full text-center font-medium text-2xl mb-4 font-epilogue">{message}</h1>
			{formType === "signin" ? (
				<SignInForm
					setFormType={setFormType}
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
				/>
			) : formType === "signup" ? (
				<SignUpForm
					setFormType={setFormType}
					email={email}
					setEmail={setEmail}
					password={password}
					setPassword={setPassword}
				/>
			) : (
				<PasswordResetRequestForm setFormType={setFormType} email={email} setEmail={setEmail} />
			)}
		</div>
	)
}
