"use client"

import { Button, SubmitButton } from "@/components/ui/buttons"
import { reset } from "@/actions/login"
import { passwordResetFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function PasswordResetForm() {
	const router = useRouter()
	const form = useForm<z.infer<typeof passwordResetFormSchema>>({
		resolver: zodResolver(passwordResetFormSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	})

	const onSubmit = async (values: z.infer<typeof passwordResetFormSchema>) => {
		await reset(values)
	}

	return (
		<>
			<h3 className="text-2xl font-semibold leading-none tracking-tight break-words font-epilogue text-center">
				reset password
			</h3>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex justify-center flex-col">
					<div>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>new password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="••••••••" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>confirm new password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<SubmitButton pendingText="resetting...">reset</SubmitButton>
				</form>
			</Form>
			<Button className="bg-muted-foreground hover:bg-muted-foreground/80" onClick={() => router.push("/login")}>
				cancel
			</Button>
		</>
	)
}
