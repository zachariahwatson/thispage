"use client"

import { Textarea } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { Comment as CommentType } from "@/lib/types"
import { editCommentFormSchema } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { UseMutationResult, useQueryClient } from "react-query"
import { z } from "zod"

interface Props {
	mutation: UseMutationResult<
		Response,
		unknown,
		{
			content: string
		},
		unknown
	>
	setVisible: Dispatch<SetStateAction<boolean>>
	commentData: CommentType | CommentType["comments"][number]
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function EditCommentForm({ mutation, setVisible, commentData }: Props) {
	const queryClient = useQueryClient()

	// 1. Define your form.
	const form = useForm<z.infer<typeof editCommentFormSchema>>({
		resolver: zodResolver(editCommentFormSchema),
		defaultValues: {
			content: commentData.content,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof editCommentFormSchema>) {
		mutation.mutate({
			content: values.content || "",
		})
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>content</FormLabel>
								<FormControl>
									<Textarea className="h-40 md:h-96" initialCharacterCount={field.value?.length} {...field}></Textarea>
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
							variant="accent"
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
