"use client"

import { Input, Textarea } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useClubMembership } from "@/contexts"
import { editClubFormSchema } from "@/lib/zod"
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
			editor_member_id: number
			name: string
			description: string
		},
		unknown
	>
	setVisible: Dispatch<SetStateAction<boolean>>
}

export function EditClubForm({ mutation, setVisible }: Props) {
	const clubMembership = useClubMembership()

	// 1. Define your form.
	const form = useForm<z.infer<typeof editClubFormSchema>>({
		resolver: zodResolver(editClubFormSchema),
		defaultValues: {
			name: clubMembership?.club.name,
			description: clubMembership?.club.description || "",
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof editClubFormSchema>) {
		mutation.mutate({
			editor_member_id: clubMembership?.id || -1,
			name: values.name || clubMembership?.club.name || "",
			description: values.description || clubMembership?.club.description || "",
		})
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>name</FormLabel>
								<FormControl>
									<Input
										initialCharacterCount={field.value.length}
										placeholder={clubMembership?.club.name}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>description</FormLabel>
								<FormControl>
									<Textarea
										className="h-40"
										placeholder={clubMembership?.club.description || ""}
										initialCharacterCount={field.value?.length}
										{...field}
									></Textarea>
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
