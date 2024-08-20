"use client"

import { useLikes } from "@/hooks/state"
import { Badge } from "../badge"
import { Button } from "../button"
import { Like } from "@/lib/types"
import { useMutation, useQueryClient } from "react-query"

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
		mutationFn: (newLike: { member_id: number }) => {
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
				return fetch(url, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
				})
			}
			return fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newLike),
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["post", clubId, readingId, postId])
			queryClient.invalidateQueries(["comments", clubId, readingId, postId])
			queryClient.invalidateQueries(["likes", memberId])
			queryClient.invalidateQueries(["posts", Number(clubId), Number(readingId)])
		},
	})

	return (
		<Button
			className="p-0 bg-background hover:bg-background mr-2"
			variant="ghost"
			onClick={() => mutation.mutate({ member_id: Number(memberId) })}
		>
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
		</Button>
	)
}
