"use client"

import { Checkbox, Input, Textarea } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/forms"
import { useClubMembership, useReading } from "@/contexts"
import { createPostFormSchema } from "@/lib/zod"
import { QueryError } from "@/utils/errors"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { z } from "zod"

interface Props {
	setVisible: Dispatch<SetStateAction<boolean>>
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function CreatePostForm({ setVisible }: Props) {
	const readingData = useReading()
	const clubMembership = useClubMembership()
	const router = useRouter()
	const queryClient = useQueryClient()
	const postMutation = useMutation({
		mutationFn: async (data: {
			reading_id: number | null
			author_member_id: number | null
			title: string
			content: string
			is_spoiler: boolean
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/readings/${readingData?.id}/posts`)
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				const body = await response.json()
				throw new QueryError(body.message, body.code)
			}

			return await response.json()
		},
		onError: (error: any) => {
			toast.error(error.message, { description: error.code })
		},
		onSettled: () => {
			setVisible(false)
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["posts", clubMembership?.club.id, readingData?.id])
		},
	})

	// 1. Define your form.
	const form = useForm<z.infer<typeof createPostFormSchema>>({
		resolver: zodResolver(createPostFormSchema),
		defaultValues: {
			title: "",
			content: "",
			isSpoiler: false,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof createPostFormSchema>) {
		postMutation.mutate({
			reading_id: readingData?.id || null,
			author_member_id: clubMembership?.id || null,
			title: values.title,
			content: values.content || "",
			is_spoiler: values.isSpoiler,
		})
	}

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="isSpoiler"
						render={({ field }) => (
							<FormItem>
								<div className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel>spoiler</FormLabel>
								</div>

								<FormDescription>
									mark if your post contains information that unfinished readers haven't gotten to yet!
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>title</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>content</FormLabel>
								<FormControl>
									<Textarea className="h-40 md:h-96" {...field}></Textarea>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-col md:flex-row-reverse float-right w-full space-y-2 md:space-y-0">
						{postMutation.isLoading ? (
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
								posting...
							</Button>
						) : (
							<Button type="submit">post</Button>
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
