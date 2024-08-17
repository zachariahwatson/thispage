"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClubFormSchema, createPostFormSchema, editClubFormSchema } from "@/lib/zod"
import { Button } from "@/components/ui/buttons"
import {
	Checkbox,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea,
} from "@/components/ui"
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "react-query"
import { toast } from "sonner"
import { revalidatePath } from "next/cache"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect } from "react"
import { useClubMembership, useReading } from "@/contexts"
import { useUser } from "@/hooks/state"

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
			name: values.name,
			description: values.description || "",
		})
		setVisible(false)
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
									<Input {...field} />
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
									<Textarea className="h-40 md:h-96" {...field}></Textarea>
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
