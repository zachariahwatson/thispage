"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createPostFormSchema } from "@/lib/zod"
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

interface Props {
	memberId: number
	clubId: number | null
	readingId: number | null
	setVisible: Dispatch<SetStateAction<boolean>>
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function CreatePostForm({ memberId, clubId, readingId, setVisible }: Props) {
	const router = useRouter()
	const queryClient = useQueryClient()
	const postMutation = useMutation({
		mutationFn: (data: {
			reading_id: number | null
			author_member_id: number
			title: string
			content: string
			is_spoiler: boolean
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts`)
			return fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			toast.success("post created!")
			queryClient.invalidateQueries(["posts", clubId, readingId])
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
			reading_id: readingId,
			author_member_id: memberId,
			title: values.title,
			content: values.content || "",
			is_spoiler: values.isSpoiler,
		})
		setVisible(false)
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
									<Textarea className="h-96" {...field}></Textarea>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{postMutation.isLoading ? (
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
							posting...
						</Button>
					) : (
						<Button type="submit" className="float-right">
							post
						</Button>
					)}
				</form>
			</Form>
		</>
	)
}
