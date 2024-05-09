"use client"

import { SignInForm, SignUpForm } from "@/components/ui"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { FieldValues, FormState } from "react-hook-form/dist/types"
import { useRouter, usePathname } from "next/navigation"

interface Props {
	searchParams: { message?: string; type?: string }
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
				toast(`${searchParams.message}`)
			}
		}
		//reset query
		router.push(path)
	}, [searchParams.message || ""])

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
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
