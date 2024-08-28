"use client"

import { Card, CardFooter, CardHeader, CardTitle, Separator } from "@/components/ui"
import {
	IntervalAvatarGroup,
	IntervalAvatarGroupSkeleton,
	ReadingPosts,
} from "@/components/ui/books/club/spreads/reading"
import { CreatePostButton } from "@/components/ui/buttons"
import { useClubMembership, usePoll, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { motion } from "framer-motion"

interface Props {
	userSpreadIndex: number
}

export function PollPageRight({ userSpreadIndex }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const MotionCard = motion(Card)
	const clubMembership = useClubMembership()
	const pollData = usePoll()
	//console.log(interval)

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
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-t-0 rounded-t-none md:border-t md:rounded-t-lg md:border-l-0 md:rounded-tl-none md:rounded-bl-none shadow-shadow shadow-md"
			variants={rightVariants}
			exit="exit"
			transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
		>
			<CardHeader className="px-4 md:px-6 h-[calc(100%-116px)]">
				<div className="flex justify-between pr-1">
					<CardTitle className="text-xl">discussion</CardTitle>
					<CreatePostButton />
				</div>
			</CardHeader>
			<div className="bg-gradient-to-r from-shadow to-background py-2 hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-b from-shadow to-background px-2 block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
