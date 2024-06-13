"use client"

import { useMutation, useQueryClient } from "react-query"
import { Textarea } from "../textarea"
import { Button } from "./button"
import { SubmitButton } from "./submit-button"
import { useState } from "react"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	clubId: string
	readingId: string
	postId: string
	memberId: string
}

export function RootCommentButton({ clubId, readingId, postId, memberId }: Props) {
	const queryClient = useQueryClient()
	const [content, setContent] = useState<string>("")
	const mutation = useMutation({
		mutationFn: (newComment: {
			post_id: number
			author_member_id: number
			content: string
			root_comment_id: null
			replying_to_comment_id: null
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments`)
			return fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newComment),
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["comments", clubId, readingId, postId])
			queryClient.invalidateQueries(["post", clubId, readingId, postId])
			setContent("")
		},
	})

	return (
		<div className="space-y-2 w-full relative">
			<Textarea
				className="mb-4"
				placeholder="type your comment here"
				onChange={(e) => setContent(e.target.value)}
				value={content}
			/>
			{mutation.isLoading ? (
				<Button disabled className="absolute bottom-6 right-2">
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
					commenting...
				</Button>
			) : (
				<Button
					onClick={() => {
						mutation.mutate({
							post_id: Number(postId),
							author_member_id: Number(memberId),
							content: content,
							root_comment_id: null,
							replying_to_comment_id: null,
						})
					}}
					className="absolute bottom-6 right-2"
				>
					comment
				</Button>
			)}
		</div>
	)
}
