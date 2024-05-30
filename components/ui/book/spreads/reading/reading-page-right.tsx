"use client"

import { Card, CardFooter, CardHeader, CardTitle, Separator } from "@/components/ui"
import { ReadingPosts, IntervalAvatarGroup, IntervalAvatarGroupSkeleton } from "@/components/ui/book"
import { Interval } from "@/lib/types"
import { motion } from "framer-motion"
import { useQuery } from "react-query"

interface Props {
	interval: Interval
	loading: boolean
	isVertical: boolean
	readingIndex: number
}

export function ReadingPageRight({ interval, loading, isVertical, readingIndex }: Props) {
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
				{/* <ReadingPosts clubId={clubId} readingId={readingId} redactSpoilers={intervals} /> */}
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex-col w-full items-start space-y-2">
				{interval && !loading ? (
					<IntervalAvatarGroup progresses={interval.member_interval_progresses} />
				) : (
					<IntervalAvatarGroupSkeleton />
				)}
			</CardFooter>
			<div className="bg-gradient-to-r from-border to-card py-2 hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 bg-foreground/5" />
			</div>
			<div className="bg-gradient-to-b from-border to-card px-2 block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 bg-foreground/5" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{readingIndex + 1}</p>
		</MotionCard>
	)
}
