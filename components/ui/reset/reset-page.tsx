"use client"

import { PasswordResetForm } from "@/components/ui/forms/login"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function ResetPage() {
	const [message, setMessage] = useState<string>("")
	const [error, setError] = useState<{ error: string; errorCode?: string; errorDescription?: string } | undefined>()
	const searchParams = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		const error = searchParams.get("error")
		const message = searchParams.get("message")

		if (error) {
			const errorCode = searchParams.get("error_code") ?? undefined
			const errorDescription = searchParams.get("error_description") ?? undefined
			setError({ error, errorCode, errorDescription })

			// Remove 'error', 'error_code', and 'error_description' from the URL without reloading
			const params = new URLSearchParams(searchParams.toString())

			params.delete("error")
			params.delete("error_code")
			params.delete("error_description")

			router.replace(`?${params.toString()}`, { scroll: false })
		} else if (message) {
			const params = new URLSearchParams(searchParams.toString())

			params.delete("message")

			router.replace(`?${params.toString()}`, { scroll: false })

			setMessage(message)
		}
	}, [searchParams, router])

	useEffect(() => {
		if (error) {
			toast.error(error.errorDescription, { description: `${error.error}: ${error.errorCode}` })
			console.error(error)
		}
	}, [error])

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 pb-16">
			<h1 className="w-full text-center font-medium text-2xl mb-4 font-epilogue">{message}</h1>
			<PasswordResetForm />
		</div>
	)
}
