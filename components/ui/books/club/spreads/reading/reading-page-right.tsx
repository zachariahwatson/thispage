"use client"

import { Card, CardFooter, CardHeader, CardTitle, Separator } from "@/components/ui"
import { IntervalAvatarGroup, ReadingPosts } from "@/components/ui/books/club/spreads/reading"
import { CreatePostButton } from "@/components/ui/buttons"
import { useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"

interface Props {
	userSpreadIndex: number
}

export function ReadingPageRight({ userSpreadIndex }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const MotionCard = motion(Card)
	const readingData = useReading()
	//console.log(interval)

	//concat user progress to intervals
	const memberProgresses = [readingData?.interval?.user_progress].concat(
		readingData?.interval?.member_interval_progresses
	)

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
			id={`club-${readingData?.club_id}-reading-${readingData?.id}-page-right`}
			className="bg-page flex-1 h-1/2 md:h-full md:w-1/2 relative border-t-0 rounded-t-none md:border-t md:rounded-t-lg md:border-l-0 md:rounded-tl-none md:rounded-bl-none shadow-shadow-dark shadow-md"
			variants={rightVariants}
			exit="exit"
			transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
		>
			<CardHeader className="px-4 md:px-6 h-[calc(100%-6.25rem)] md:h-[calc(100%-118px)] pt-4 md:pt-6">
				<div className="flex justify-between pr-1">
					<CardTitle className="text-md md:text-xl">discussion</CardTitle>
					<CreatePostButton />
				</div>

				<ReadingPosts
					redactSpoilers={
						readingData?.interval?.user_progress ? !readingData?.interval?.user_progress.is_complete : true
					}
					intervalDate={readingData?.interval?.created_at || ""}
				/>
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex-col w-full items-start space-y-2 md:p-6 p-4 pb-6">
				{memberProgresses && <IntervalAvatarGroup progresses={memberProgresses} />}
			</CardFooter>
			<div className="bg-gradient-to-r from-shadow to-page py-2 hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-b from-shadow to-page px-2 block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
