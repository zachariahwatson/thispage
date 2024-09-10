"use client"

import { ScrollArea } from "@/components/ui"
import { ReadingPost, ReadingPostSkeleton } from "@/components/ui/books/club/spreads/reading"
import { Button } from "@/components/ui/buttons"
import { useClubMembership, useReading } from "@/contexts"
import type { ReadingPost as ReadingPostType } from "@/lib/types"
import { QueryError } from "@/utils/errors"
import { useQuery } from "react-query"

interface Props {
	redactSpoilers: boolean
	intervalDate: string
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function ReadingPosts({ redactSpoilers, intervalDate }: Props) {
	const clubMembership = useClubMembership()
	const readingData = useReading()

	//fetch reading's posts
	const fetchPosts = async () => {
		const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/readings/${readingData?.id}/posts`)
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
		data: posts,
		isLoading: loading,
		error,
		refetch,
	} = useQuery<ReadingPostType[]>(["posts", clubMembership?.club.id, readingData?.id], () => fetchPosts())

	return (
		/**
		 * @todo - figure out why it's becoming display: table
		 */
		<div className="h-full">
			{/* <ScrollArea className="border rounded-lg min-h-[124px] h-[calc(50svh-217px)] md:h-[418px] shadow-shadow shadow-inner"> */}
			<div className="border rounded-lg h-full shadow-shadow shadow-inner w-full overflow-y-scroll">
				{error ? (
					<div className="p-3 md:p-4 bg-destructive/15 flex flex-col justify-center items-center h-full text-destructive space-y-2">
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
				) : (
					<div className="p-3 md:p-4 w-full h-auto">
						{posts
							? posts.map((post) =>
									readingData?.interval?.user_progress ? (
										(!redactSpoilers &&
											post.is_spoiler &&
											new Date(post.created_at).getTime() > new Date(intervalDate).getTime()) ||
										!post.is_spoiler ||
										(post.is_spoiler && new Date(post.created_at).getTime() < new Date(intervalDate).getTime()) ? (
											<ReadingPost key={post.id} likes={post.likes_count} id={post.id}>
												{post.title}
											</ReadingPost>
										) : (
											<ReadingPost disabled key={post.id} likes={post.likes_count} id={-1}>
												⚠️spoiler⚠️complete the reading!
											</ReadingPost>
										)
									) : (
										<ReadingPost disabled key={post.id} likes={post.likes_count} id={-1}>
											join the reading to view!
										</ReadingPost>
									)
							  )
							: loading && (
									<>
										<ReadingPostSkeleton />
										<ReadingPostSkeleton />
										<ReadingPostSkeleton />
									</>
							  )}
					</div>
				)}
			</div>
			{/* </ScrollArea> */}
		</div>
	)
}
