"use client"

import { PasswordResetForm } from "@/components/ui/forms/login"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Props {
	searchParams: { message?: string; type?: string; redirect: string }
}

export default function Reset({ searchParams }: Props) {
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
			<h1 className="w-full text-center font-medium text-2xl mb-4 font-epilogue">{message}</h1>
			<PasswordResetForm />
		</div>
	)
}
