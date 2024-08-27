"use client"

import { Comment, CommentSkeleton } from "@/components/ui/post"
import type { ClubMembership, Comment as CommentType } from "@/lib/types"
import { useQuery } from "react-query"

interface Props {
	clubId: string
	readingId: string
	postId: string
	memberId: string
	clubMembership: ClubMembership
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function PostComments({ clubId, readingId, postId, memberId, clubMembership }: Props) {
	//fetch other members' intervals
	const fetchComments = async () => {
		const url = new URL(`${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments`)
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			const body = await response.json()
			throw new Error(body.error)
		}

		return await response.json()
	}

	const { data: comments, isLoading: loading } = useQuery<CommentType[]>(["comments", clubId, readingId, postId], () =>
		fetchComments()
	)

	return (
		<div className="space-y-4">
			{!loading && comments ? (
				comments?.map((comment) => (
					<Comment
						key={comment.id}
						commentData={comment}
						clubId={clubId}
						readingId={readingId}
						postId={postId}
						memberId={memberId}
						clubMembership={clubMembership}
					/>
				))
			) : (
				<>
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
				</>
			)}
		</div>
	)
}
