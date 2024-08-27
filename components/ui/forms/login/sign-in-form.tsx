"use client"

import { Button, SubmitButton } from "@/components/ui/buttons"
import { signIn, signInWithGoogle } from "@/actions/login"
import { signInFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms/form"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction } from "react"

interface Props {
	setFormType: Dispatch<SetStateAction<string>>
	email: string
	setEmail: Dispatch<SetStateAction<string>>
	password: string
	setPassword: Dispatch<SetStateAction<string>>
}

export function SignInForm({ setFormType, email, setEmail, password, setPassword }: Props) {
	const form = useForm<z.infer<typeof signInFormSchema>>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: email,
			password: password,
		},
	})

	const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
		await signIn(values)
	}

	const handleFormChange = () => {
		setEmail(form.getValues("email"))
		setPassword(form.getValues("password"))
		setFormType("signup")
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex justify-center flex-col">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>email</FormLabel>
								<FormControl>
									<Input placeholder="you@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="••••••••" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<SubmitButton pendingText="signing in...">sign in</SubmitButton>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-background px-2 text-muted-foreground">or</span>
						</div>
					</div>
				</form>
			</Form>
			<form>
				<SubmitButton
					type="submit"
					formAction={signInWithGoogle}
					pendingText="signing in..."
					className="w-full bg-foreground text-background hover:opacity-90 hover:bg-foreground transition-opacity"
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="mr-2"
					>
						<path
							d="M6 12C6 15.3137 8.68629 18 12 18C14.6124 18 16.8349 16.3304 17.6586 14H12V10H21.8047V14H21.8C20.8734 18.5645 16.8379 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.445 2 18.4831 3.742 20.2815 6.39318L17.0039 8.68815C15.9296 7.06812 14.0895 6 12 6C8.68629 6 6 8.68629 6 12Z"
							fill="currentColor"
						/>
					</svg>
					sign in with google
				</SubmitButton>
			</form>
			<div className="flex flex-row justify-center items-center">
				don't have an account?
				<Button onClick={handleFormChange} variant="link" className="underline text-md" size="sm">
					sign up
				</Button>
			</div>
		</>
	)
}
