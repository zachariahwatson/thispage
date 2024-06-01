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

interface Props {
	clubId: number | null
	readingId: number | null
	redactSpoilers: boolean
}

export function ReadingPosts({ clubId, readingId, redactSpoilers }: Props) {
	//gotta make a ref for the scrollarea to apply to the child div inside it - doing this because scrollarea adds a dive in between them with display:table and it messes up the truncation so we have to manually set the width back to what it's supposed to be
	const scrollAreaRef = useRef<ScrollAreaElement>(null)
	const [innerWidth, setInnerWidth] = useState<string | number>("auto")

	//fetch reading's posts
	const fetchPosts = async () => {
		const url = new URL(`http://localhost:3000/api/clubs/${clubId}/readings/${readingId}/posts`)
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

	const { data: posts, isLoading: loading } = useQuery<ReadingPostType[]>(["posts", clubId, readingId], () =>
		fetchPosts()
	)

	// Set the inner div width based on the ScrollArea width
	useEffect(() => {
		const handleResize = () => {
			if (scrollAreaRef.current) {
				setInnerWidth(scrollAreaRef.current.clientWidth)
			}
		}

		handleResize() // Set initial width

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return (
		/**
		 * @todo - figure out why it's becoming display: table
		 */
		<ScrollArea ref={scrollAreaRef} className="border rounded-lg h-[200px] md:h-[418px] shadow-shadow shadow-inner">
			<div className="p-3 md:p-4" style={{ width: innerWidth }}>
				{!loading && posts ? (
					posts.map((post) =>
						redactSpoilers && post.is_spoiler ? (
							<ReadingPost key={post.id} likes={0} id={-1} clubId={clubId} readingId={readingId}>
								⚠️spoiler⚠️complete the reading!
							</ReadingPost>
						) : (
							<ReadingPost key={post.id} likes={post.likes_count} id={post.id} clubId={clubId} readingId={readingId}>
								{post.title}
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
	)
}
