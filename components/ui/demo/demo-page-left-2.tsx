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

export function DemoPageLeft2({ readingIndex, demoIsComplete, setDemoIsComplete }: Props) {
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
			<CardContent className="md:space-y-4 pt-4">
				<div className="space-y-2">
					<CardTitle className="text-md md:text-xl">
						<span className="font-black text-primary">create</span> multiple readings per club.
					</CardTitle>
					<CardDescription className="text-xs md:text-sm">
						readers can pick specific books they want to participate in.
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
