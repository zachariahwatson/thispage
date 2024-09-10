"use client"

import { Comment, CommentSkeleton } from "@/components/ui/post"
import { Button } from "@/components/ui/buttons"
import type { ClubMembership, Comment as CommentType } from "@/lib/types"
import { QueryError } from "@/utils/errors"
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
			throw new QueryError(body.message, body.code)
		}

		return await response.json()
	}

	const {
		data: comments,
		isLoading: loading,
		error,
		refetch,
	} = useQuery<CommentType[]>(["comments", clubId, readingId, postId], () => fetchComments())

	return (
		<div className="space-y-4">
			{!error ? (
				!loading && comments ? (
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
				)
			) : (
				<div className="p-3 md:p-4 flex flex-col justify-center items-center h-full text-destructive space-y-2">
					<div className="flex flex-row justify-center items-center w-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-16 mr-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
							/>
						</svg>
						<div>
							<p>{(error as QueryError).message}</p>
							<p className="text-muted-foreground">{(error as QueryError).code}</p>
						</div>
					</div>
					<Button
						variant="secondary"
						onClick={(e) => {
							e.preventDefault()
							refetch()
						}}
					>
						retry
					</Button>
				</div>
			)}
		</div>
	)
}
