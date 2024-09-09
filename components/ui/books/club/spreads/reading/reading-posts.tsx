"use client"

import { ScrollArea } from "@/components/ui"
import { ReadingPost, ReadingPostSkeleton } from "@/components/ui/books/club/spreads/reading"
import { useClubMembership, useReading } from "@/contexts"
import type { ReadingPost as ReadingPostType } from "@/lib/types"
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
			throw new Error(body.error)
		}

		return await response.json()
	}

	const { data: posts, isLoading: loading } = useQuery<ReadingPostType[]>(
		["posts", clubMembership?.club.id, readingData?.id],
		() => fetchPosts()
	)

	return (
		/**
		 * @todo - figure out why it's becoming display: table
		 */
		<div className="h-full">
			{/* <ScrollArea className="border rounded-lg min-h-[124px] h-[calc(50svh-217px)] md:h-[418px] shadow-shadow shadow-inner"> */}
			<div className="border rounded-lg h-full shadow-shadow shadow-inner w-full overflow-y-scroll">
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
			</div>
			{/* </ScrollArea> */}
		</div>
	)
}
