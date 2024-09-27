"use client"

import { Textarea } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import type { Comment as CommentType } from "@/lib/types"
import { QueryError } from "@/utils/errors"
import { Dispatch, SetStateAction, useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	setReplyBoxVisible: Dispatch<SetStateAction<boolean>>
	rootCommentId: number
	subCommentData: CommentType["comments"][number]
	clubId: string
	readingId: string
	postId: string
	memberId: string
}

export function SubCommentButton({
	setReplyBoxVisible,
	rootCommentId,
	subCommentData,
	clubId,
	readingId,
	postId,
	memberId,
}: Props) {
	const queryClient = useQueryClient()
	const [content, setContent] = useState<string>("")
	const mutation = useMutation({
		mutationFn: async (newComment: {
			post_id: number
			author_member_id: number
			content: string
			root_comment_id: number
			replying_to_comment_id: number
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments`)
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newComment),
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
		onSuccess: () => {
			queryClient.invalidateQueries(["comments", clubId, readingId, postId])
			queryClient.invalidateQueries(["post", clubId, readingId, postId])
			setReplyBoxVisible(false)
			setContent("")
		},
	})

	const handleSubmit = () => {
		if (content) {
			mutation.mutate({
				post_id: Number(postId),
				author_member_id: Number(memberId),
				content: content,
				root_comment_id: rootCommentId,
				replying_to_comment_id: subCommentData.id,
			})
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault() // Prevents newline from being added in textarea
			handleSubmit()
		}
	}

	return (
		<div className="w-full relative">
			<Textarea
				className="h-48 md:h-full mb-2"
				placeholder="type your reply here"
				onChange={(e) => setContent(e.target.value)}
				value={content}
				onKeyDown={handleKeyDown}
			/>
			<div className="float-right space-x-1">
				<Button size="sm" variant="accent" onClick={() => setReplyBoxVisible(false)}>
					cancel
				</Button>
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
						replying...
					</Button>
				) : (
					<Button onClick={handleSubmit} size="sm">
						reply
					</Button>
				)}
			</div>
		</div>
	)
}
