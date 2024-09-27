"use client"

import { Button, SubmitButton } from "@/components/ui/buttons"
import { resetRequest } from "@/actions/login"
import { passwordResetRequestFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms/form"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction } from "react"

interface Props {
	setFormType: Dispatch<SetStateAction<string | undefined>>
	email: string
	setEmail: Dispatch<SetStateAction<string>>
}

export function PasswordResetRequestForm({ setFormType, email, setEmail }: Props) {
	const form = useForm<z.infer<typeof passwordResetRequestFormSchema>>({
		resolver: zodResolver(passwordResetRequestFormSchema),
		defaultValues: {
			email: email,
		},
	})

	const onSubmit = async (values: z.infer<typeof passwordResetRequestFormSchema>) => {
		await resetRequest(values)
		form.reset()
		handleFormChange()
	}

	const handleFormChange = () => {
		setEmail(form.getValues("email"))
		setFormType("signin")
	}

	return (
		<>
			<h3 className="text-2xl font-semibold leading-none tracking-tight break-words font-epilogue text-center">
				request password reset
			</h3>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex justify-center flex-col">
					<div>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="you@example.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div>
						<div className="flex flex-col items-end">
							<SubmitButton className="w-full" pendingText="sending...">
								send reset email
							</SubmitButton>
						</div>
					</div>
				</form>
			</Form>
			<Button className="bg-muted-foreground hover:bg-muted-foreground/80" onClick={handleFormChange}>
				cancel
			</Button>
		</>
	)
}
