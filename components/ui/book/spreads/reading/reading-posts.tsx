"use client"

// import { ReadingType, ReadingPostType } from "@/utils/types"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
	ScrollArea,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui"
import {
	IntervalAvatarGroup,
	IntervalAvatarGroupSkeleton,
	ReadingPageLeft,
	ReadingPageRight,
	ReadingPost,
	ReadingPostSkeleton,
} from "@/components/ui/book"
import { Separator } from "../../../separator"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/buttons"
import Image from "next/image"
import { ScrollAreaElement } from "@radix-ui/react-scroll-area"
import { useQuery } from "react-query"
import type { ReadingPost as ReadingPostType } from "@/lib/types"
import { useClubMembership, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"

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
	//gotta make a ref for the scrollarea to apply to the child div inside it - doing this because scrollarea adds a dive in between them with display:table and it messes up the truncation so we have to manually set the width back to what it's supposed to be
	const scrollAreaRef = useRef<ScrollAreaElement>(null)
	const scrollAreaWrapperRef = useRef<HTMLDivElement>(null)
	const isVertical = useMediaQuery("(max-width: 768px)")
	const [innerWidth, setInnerWidth] = useState<string | number>("auto")
	const [innerHeight, setInnerHeight] = useState<string | number>("auto")

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
			<ScrollArea className="border rounded-lg min-h-[124px] h-[calc(50svh-217px)] md:h-[418px] shadow-shadow shadow-inner">
				<div className="p-3 md:p-4" style={{ width: innerWidth, height: innerHeight }}>
					{!loading && posts ? (
						posts.map((post) =>
							redactSpoilers &&
							((post.is_spoiler && new Date(post.created_at).getTime() < new Date(intervalDate).getTime()) ||
								!post.is_spoiler) ? (
								<ReadingPost key={post.id} likes={post.likes_count} id={post.id}>
									{post.title}
								</ReadingPost>
							) : (
								<ReadingPost disabled key={post.id} likes={0} id={-1}>
									⚠️spoiler⚠️complete the reading!
								</ReadingPost>
							)
						)
					) : (
						<>
							<ReadingPostSkeleton />
							<ReadingPostSkeleton />
							<ReadingPostSkeleton />
						</>
					)}
				</div>
			</ScrollArea>
		</div>
	)
}
