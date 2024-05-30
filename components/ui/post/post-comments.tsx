"use client"

import { CommentType } from "@/utils/types"
import { useQuery } from "react-query"
import { Comment, CommentSkeleton } from "./comment"

interface Props {
	clubId: string
	readingId: string
	postId: string
}

export function PostComments({ clubId, readingId, postId }: Props) {
	//fetch other members' intervals
	const fetchComments = async () => {
		const url = new URL(`http://localhost:3000/api/clubs/${clubId}/readings/${readingId}/posts/${postId}/comments`)
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
