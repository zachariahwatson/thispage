"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { settingsFormSchema } from "@/lib/zod"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components/ui"
import { UseMutationResult, useMutation, useQuery } from "react-query"
import { toast } from "sonner"
import { revalidatePath } from "next/cache"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useUser } from "@/hooks/state"

interface Props {
	mutation: UseMutationResult<
		Response,
		unknown,
		{
			first_name: string
			last_name: string
		},
		unknown
	>
	setVisible: Dispatch<SetStateAction<boolean>>
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function SettingsForm({ mutation, setVisible }: Props) {
	// 1. Define your form.
	const form = useForm<z.infer<typeof settingsFormSchema>>({
		resolver: zodResolver(settingsFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
		},
	})

	const fetchUser = async () => {
		const url = new URL(`${defaultUrl}/api/users`)
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			const body = await response.json()
			throw new Error(body.error)
		}

		return await response.json()
	}

	const { data: user } = useUser()

	const firstName = user?.first_name ? user?.first_name : user?.name.split(" ")[0]
	const lastName = user?.last_name ? user?.last_name : user?.name.split(" ")[1]

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof settingsFormSchema>) {
		mutation.mutate({ first_name: values.firstName || firstName, last_name: values.lastName || lastName })
		setVisible(false)
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>first name</FormLabel>
								<FormControl>
									<Input placeholder={firstName} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>last name</FormLabel>
								<FormControl>
									<Input placeholder={lastName} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{mutation.isLoading ? (
						<Button disabled className="float-right">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 animate-spin mr-2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
							saving...
						</Button>
					) : (
						<Button type="submit" className="float-right">
							save
						</Button>
					)}
				</form>
			</Form>
		</>
	)
}
