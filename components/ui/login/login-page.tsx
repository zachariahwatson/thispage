"use client"

import { PasswordResetRequestForm, SignInForm, SignUpForm } from "@/components/ui/forms/login"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
	searchParams: {
		error?: string
		error_code?: string
		error_description?: string
		message?: string
		redirect?: string
	}
}

export function LoginPage({ searchParams }: Props) {
	const [formType, setFormType] = useState<string | undefined>()
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [message, setMessage] = useState<string>("")
	const router = useRouter()

	useEffect(() => {
		if (searchParams.error) {
			//if you want to toast on load, you must wrap in a setTimeout()
			setTimeout(() =>
				toast.error(searchParams.error_description, {
					description: `${searchParams.error}: ${searchParams.error_code}`,
				})
			)
			console.error(searchParams.error_description, `\n${searchParams.error}: ${searchParams.error_code}`)
		}

		if (searchParams.message) {
			setMessage(searchParams.message)
		}

		if (searchParams.error || searchParams.message) {
			// convert the searchParams object into URLSearchParams
			const params = new URLSearchParams(
				Object.entries(searchParams)
					.filter(([_, value]) => value !== undefined && value !== null) // remove undefined/null entries
					.map(([key, value]) => [key, String(value)]) // ensure values are strings
			)

			params.delete("error")
			params.delete("error_code")
			params.delete("error_description")
			params.delete("message")

			router.replace(`?${params.toString()}`, { scroll: false })
		}
	}, [searchParams])

	useEffect(() => {
		if (formType) {
			setMessage("")
		}
	}, [formType])

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 pb-16">
			{searchParams.redirect && (
				<h1 className="w-full text-center font-medium text-2xl mb-4 font-epilogue">log in to view that page ;)</h1>
			)}
			<h1 className="w-full text-center font-medium text-2xl mb-4 font-epilogue">{message}</h1>
			{!formType || formType === "signin" ? (
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
