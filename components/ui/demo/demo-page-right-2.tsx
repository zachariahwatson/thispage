"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Separator } from "@/components/ui"
import { ReadingPosts, IntervalAvatarGroup, IntervalAvatarGroupSkeleton } from "@/components/ui/book"
import { CreatePostButton } from "@/components/ui/buttons"
import { useClubMembership, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { Interval, MemberProgress, Reading } from "@/lib/types"
import { motion } from "framer-motion"
import { useQuery } from "react-query"
import Image from "next/image"
import { DemoReadingPosts } from "./demo-reading-posts"

interface Props {
	readingIndex: number
	demoIsComplete: boolean
}

export function DemoPageRight2({ readingIndex, demoIsComplete }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const MotionCard = motion(Card)
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
			<CardContent className="md:space-y-4 pt-4">
				<div className="space-y-2">
					<CardTitle className="text-md md:text-xl">
						<span className="font-black text-primary">poll</span> your members for the next book to read.
					</CardTitle>
					<CardDescription className="text-xs md:text-sm">
						the top selection will be added as a reading.
					</CardDescription>
					<div className="px-10 md:px-6">
						<Image
							src="/images/demo-placeholder.png"
							width={414}
							height={192}
							alt="image of demo placeholder"
							className=" rounded-md"
						></Image>
					</div>
				</div>
			</CardContent>

			<CardFooter className="absolute bottom-0 right-12 flex-col items-center space-y-2 md:p-6 p-4 pb-6">
				<CardTitle className="flex flex-row text-md md:text-xl">view a demo reading 👉</CardTitle>
			</CardFooter>
			<div className="bg-gradient-to-r from-shadow to-background py-2 hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-b from-shadow to-background px-2 block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{readingIndex + 1}</p>
		</MotionCard>
	)
}
