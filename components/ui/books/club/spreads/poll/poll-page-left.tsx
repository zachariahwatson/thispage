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
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import { ArchiveButton, CompleteIntervalButton, JoinReadingButton, ReadingActionsButton } from "@/components/ui/buttons"
import { useClubMembership, useFirstLoadAnimation, usePoll, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

interface Props {
	userSpreadIndex: number
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function PollPageLeft({ userSpreadIndex }: Props) {
	const MotionCard = motion(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(false)
	const pollData = usePoll()
	const clubMembership = useClubMembership()
	const isVertical = useMediaQuery("(max-width: 768px)")
	const endDate = new Date(pollData?.end_date || "")
	const firstLoad = useFirstLoadAnimation()

	//framer motion responsive animation (turns book page flip into notepad page flip)
	const leftVariants = isVertical
		? {
				initial: { rotateX: flipOnce ? 0 : -90, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: flipOnce ? 0 : firstLoad?.firstLoad ? 90 : 180, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	return (
		<MotionCard
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-shadow shadow-md"
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: firstLoad?.firstLoad ? 0.1 : 0.2, delay: 0.1, ease: "easeIn" }}
			style={{ transformPerspective: 2500 }}
			onAnimationComplete={() => {
				setFlipOnce(true)
			}}
			onUpdate={(latest) => {
				// Check if the animation has progressed past a certain point
				if (!firstLoad?.firstLoad && latest.rotateY && Number(latest.rotateY) < 90) {
					firstLoad?.setFirstLoad(true)
				}
			}}
		>
			{firstLoad?.firstLoad && (
				<>
					<CardHeader className="px-4 md:px-6">
						<CardTitle className="text-xl">poll</CardTitle>
						<Separator />
						<CardTitle className="text-xl md:text-2xl">{pollData?.name}</CardTitle>
						<CardDescription>{pollData?.description}</CardDescription>
					</CardHeader>
					<CardFooter className="absolute bottom-4">
						<CardDescription className="text-xl">
							this poll ends on{" "}
							{endDate.toLocaleDateString(undefined, {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</CardDescription>
					</CardFooter>
				</>
			)}
			<div className="bg-gradient-to-l from-shadow to-background py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-background px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
