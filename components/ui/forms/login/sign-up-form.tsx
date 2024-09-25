"use client"

import { Button, SubmitButton } from "@/components/ui/buttons"
import { Checkbox, Separator } from "@/components/ui"
import { signUp, signInWithGoogle } from "@/actions/login"
import { signUpFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { Input } from "@/components/ui/input"
import { Dispatch, SetStateAction } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Props {
	setFormType: Dispatch<SetStateAction<string | undefined>>
	email: string
	setEmail: Dispatch<SetStateAction<string>>
	password: string
	setPassword: Dispatch<SetStateAction<string>>
}

export function SignUpForm({ setFormType, email, setEmail, password, setPassword }: Props) {
	const router = useRouter()
	const form = useForm<z.infer<typeof signUpFormSchema>>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: email,
			password: password,
			confirmPassword: "",
			acceptTerms: false,
		},
	})

	const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
		await signUp(values)
		form.reset()
		handleFormChange()
	}

	const handleFormChange = () => {
		setEmail(form.getValues("email"))
		setPassword(form.getValues("password"))
		setFormType("signin")
	}

	return (
		<>
			<h3 className="text-2xl font-semibold leading-none tracking-tight break-words font-epilogue text-center">
				sign up
			</h3>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex justify-center flex-col">
					<div>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>first name</FormLabel>
									<FormControl>
										<Input {...field} />
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
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>email</FormLabel>
									<FormControl>
										<Input type="email" placeholder="you@example.com" showCharacterCount={false} {...field} />
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
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>confirm password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="acceptTerms"
						render={({ field }) => (
							<FormItem>
								<div className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel>accept terms and conditions</FormLabel>
								</div>
								<FormDescription>
									you agree to our{" "}
									<Link
										href="/terms"
										className="hover:underline text-primary"
										target="_blank"
										rel="noopener noreferrer"
									>
										terms of service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="hover:underline text-primary"
										target="_blank"
										rel="noopener noreferrer"
									>
										privacy policy
									</Link>
									.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<SubmitButton pendingText="signing up...">sign up</SubmitButton>

					<div className="flex flex-row justify-center items-center text-xs">
						<Separator className="bg-muted-foreground w-5/12" />
						<span className="bg-background px-2 text-muted-foreground">or</span>
						<Separator className="bg-muted-foreground w-5/12" />
					</div>
				</form>
			</Form>
			<form>
				<SubmitButton
					type="submit"
					formAction={signInWithGoogle}
					pendingText="signing up..."
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
					sign up with google
				</SubmitButton>
			</form>
			<div className="flex flex-row justify-center items-center">
				have an account?
				<Button onClick={handleFormChange} variant="link" className="text-md" size="sm">
					sign in
				</Button>
			</div>
		</>
	)
}
