"use client"

import { Input } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useUser } from "@/hooks/state"
import { settingsFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { UseMutationResult } from "react-query"
import { z } from "zod"

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
	const { data: user } = useUser()

	const firstName = user?.first_name ? user?.first_name : user?.name.split(" ")[0]
	const lastName = user?.last_name ? user?.last_name : user?.name.split(" ")[1]

	// 1. Define your form.
	const form = useForm<z.infer<typeof settingsFormSchema>>({
		resolver: zodResolver(settingsFormSchema),
		defaultValues: {
			firstName: firstName,
			lastName: lastName,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof settingsFormSchema>) {
		mutation.mutate({ first_name: values.firstName || firstName, last_name: values.lastName || lastName })
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
					<div className="flex flex-col md:flex-row-reverse float-right w-full space-y-2 md:space-y-0">
						{mutation.isLoading ? (
							<Button disabled>
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
							<Button type="submit">save</Button>
						)}
						<Button
							variant="secondary"
							className="md:mr-2"
							onClick={(event) => {
								event.preventDefault()
								setVisible(false)
							}}
						>
							cancel
						</Button>
					</div>
				</form>
			</Form>
		</>
	)
}
