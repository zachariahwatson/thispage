"use client"

import { useQuery } from "react-query"
import { Comment, CommentSkeleton } from "./comment"
import type { Comment as CommentType } from "@/lib/types"

interface Props {
	clubId: string
	readingId: string
	postId: string
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function PostComments({ clubId, readingId, postId }: Props) {
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
				comments?.map((comment) => <Comment key={comment.id} commentData={comment} />)
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
