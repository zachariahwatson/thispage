"use client"

import { Card, CardFooter, CardHeader, CardTitle, Separator } from "@/components/ui"
import { ReadingPosts, IntervalAvatarGroup, IntervalAvatarGroupSkeleton } from "@/components/ui/book"
import { IntervalType, ReadingType } from "@/utils/types"
import { motion } from "framer-motion"
import { useQuery } from "react-query"

interface Props {
	clubId: number
	readingId: number
	isVertical: boolean
	clubIndex: number
	userInterval: ReadingType["intervals"][0] | null
}

export function ReadingPageRight({ clubId, readingId, isVertical, clubIndex, userInterval }: Props) {
	const MotionCard = motion(Card)

	//fix initial and animate
	const rightVariants = isVertical
		? {
				initial: { rotateX: 0, originY: 0, zIndex: 2 },
				animate: { rotateX: 90, originY: 0, zIndex: 2 },
				exit: { rotateX: 90, originY: 0, zIndex: 2 },
		  }
		: {
				initial: { rotateY: 0, originX: 0, zIndex: 2 },
				animate: { rotateY: -90, originX: 0, zIndex: 2 },
				exit: { rotateY: -90, originX: 0, zIndex: 2 },
		  }

	//fetch other members' intervals
	const fetchIntervals = async () => {
		const url = new URL(`http://127.0.0.1:3000/api/clubs/${clubId}/readings/${readingId}/intervals`)
		url.searchParams.append("current", "true")
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

	const { data: intervals, isLoading: intervalLoading } = useQuery<IntervalType[]>(
		["intervals", clubId, readingId],
		() => fetchIntervals()
	)

	// sort intervals with user's interval first
	const sortedIntervals =
		intervals?.sort((a, b) => {
			if (a.id === userInterval?.id) return -1 // user's interval first
			if (b.id === userInterval?.id) return 1 // user's interval first
			return 0
		}) || []

	return (
		<MotionCard
			className="flex-1 h-1/2 md:h-full md:w-1/2 relative border-t-0 rounded-t-none md:border-t md:rounded-t-lg md:border-l-0 md:rounded-tl-none md:rounded-bl-none shadow-md"
			variants={rightVariants}
			exit="exit"
			transition={{ type: "tween", duration: 0.15, ease: "easeIn" }}
			style={{ transformPerspective: 2500 }}
		>
			<CardHeader>
				<CardTitle className="text-xl">discussion</CardTitle>
				<ReadingPosts clubId={clubId} readingId={readingId} clubIndex={clubIndex} userInterval={userInterval} />
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex-col w-full items-start space-y-2">
				{intervals && !intervalLoading ? (
					<IntervalAvatarGroup intervals={sortedIntervals} userInterval={userInterval} />
				) : (
					<IntervalAvatarGroupSkeleton />
				)}
			</CardFooter>
			<div className="bg-gradient-to-r from-border to-card py-2 border-y hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 bg-foreground/5" />
			</div>
			<div className="bg-gradient-to-b from-border to-card px-2 border-x block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 bg-foreground/5" />
			</div>
		</MotionCard>
	)
}
