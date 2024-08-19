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
	const hasLiked = userLikes?.some(
		(like: Like) =>
			(like.post_id === postId && postId !== undefined) || (like.comment_id === commentId && commentId !== undefined)
	)
	console.log(hasLiked)

	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: (newLike: { member_id: number }) => {
			const url = new URL(
				commentId
					? `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments/${commentId}/likes`
					: `${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/likes`
			)
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
		},
	})

	return (
		<Button
			className="p-0 bg-background hover:bg-background mr-2"
			variant="ghost"
			onClick={() => mutation.mutate({ member_id: Number(memberId) })}
		>
			<Badge variant={hasLiked ? "default" : "outline"}>{likesCount} 👍</Badge>
		</Button>
	)
}
