"use client"

import { Badge } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useLikes } from "@/hooks/state"
import { Like } from "@/lib/types"
import { QueryError } from "@/utils/errors"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	likesCount: number
	clubId: string
	readingId: string
	postId?: string
	commentId?: string
	memberId: string
}

export function LikeButton({ likesCount, clubId, readingId, postId, commentId, memberId }: Props) {
	const { data: userLikes } = useLikes({ memberId })

	// check if user has already liked the post or comment
	const hasLiked = userLikes?.find((like: Like) =>
		commentId ? like.comment_id === Number(commentId) : like.post_id === Number(postId)
	)

	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: async (newLike: { member_id: number }) => {
			const url = new URL(
				hasLiked
					? commentId
						? `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments/${commentId}/likes/${hasLiked.id}`
						: `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/likes/${hasLiked.id}`
					: commentId
					? `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments/${commentId}/likes`
					: `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/likes`
			)
			if (hasLiked) {
				const response = await fetch(url, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				})
				if (!response.ok) {
					const body = await response.json()
					throw new QueryError(body.message, body.code)
				}

				return await response.json()
			}
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newLike),
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
			queryClient.invalidateQueries(["post", clubId, readingId, postId])
			queryClient.invalidateQueries(["comments", clubId, readingId, postId])
			queryClient.invalidateQueries(["likes", memberId])
			queryClient.invalidateQueries(["posts", Number(clubId), Number(readingId)])
		},
	})

	return (
		<button className="mr-2 -mt-1.5" onClick={() => mutation.mutate({ member_id: Number(memberId) })}>
			<Badge variant={hasLiked ? "default" : "outline"}>
				{mutation.isLoading ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-3 animate-spin"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				) : (
					likesCount
				)}{" "}
				👍
			</Badge>
		</button>
	)
}
