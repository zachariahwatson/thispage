"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
	Separator,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui"
import { Button, JoinReadingButton, CompleteIntervalButton, DemoCompleteIntervalButton } from "@/components/ui/buttons"
import { useClubMembership, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { Interval, MemberProgress, Reading } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useQuery } from "react-query"

interface Props {
	readingIndex: number
	demoIsComplete: boolean
	setDemoIsComplete: Dispatch<SetStateAction<boolean>>
}

export function DemoPageLeft1({ readingIndex, demoIsComplete, setDemoIsComplete }: Props) {
	const MotionCard = motion(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(false)
	const isVertical = useMediaQuery("(max-width: 768px)")

	//framer motion responsive animation (turns book page flip into notepad page flip)
	const leftVariants = isVertical
		? {
				initial: { rotateX: flipOnce ? 0 : -90, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: flipOnce ? 0 : 90, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	return (
		<MotionCard
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-shadow shadow-md"
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: 0.1, delay: 0.1, ease: "easeIn" }}
			style={{ transformPerspective: 2500 }}
			onAnimationComplete={() => setFlipOnce(true)}
		>
			<CardHeader className="pb-2">
				<CardTitle className="text-lg md:text-2xl">...a simple site for book clubs.</CardTitle>
				<Separator />
			</CardHeader>
			<CardContent className="md:space-y-4">
				<div className="space-y-2">
					<CardTitle className="text-md md:text-xl">
						<span className="font-black">track</span> what page your readers need to read to.
					</CardTitle>
					<CardDescription className="text-xs md:text-sm">
						the goal page updates automatically once every reader has finished the reading interval.
					</CardDescription>
				</div>
			</CardContent>
			<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-background/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md bg-background/80 rounded-none rounded-t-lg md:rounded-none md:rounded-l-lg">
				<CardContent className="pr-0 pt-2 md:px-6 px-4">
					<CardDescription>read to...</CardDescription>
					<div className="flex flex-row">
						<p className="font-bold italic md:text-xl">
							p.
							<span className="text-6xl md:text-8xl not-italic">99</span>
						</p>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1}
							stroke="currentColor"
							className="w-12 md:w-14 h-12 md:h-14 self-center"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
						</svg>
						<div className="self-center">
							<DemoCompleteIntervalButton isComplete={demoIsComplete} setIsComplete={setDemoIsComplete} />
						</div>
					</div>
					<CardDescription className="italic">{demoIsComplete ? "4" : "3"}/8 readers have completed</CardDescription>
				</CardContent>
				<CardFooter className="md:px-6 px-4">
					<Progress value={Math.floor((40 / 348) * 100)} className="h-2 md:h-4" />
				</CardFooter>
			</Card>
			<div className="bg-gradient-to-l from-shadow to-background py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-background px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{readingIndex + 1}</p>
		</MotionCard>
	)
}
