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
import {
	ArchiveButton,
	CompleteIntervalButton,
	JoinReadingButton,
	PollActionsButton,
	ReadingActionsButton,
} from "@/components/ui/buttons"
import { useClubMembership, useFirstLoadAnimation, usePoll, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { PollPodium } from "@/components/ui/books/club/spreads/poll"

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
				initial: { rotateX: flipOnce ? 0 : firstLoad?.firstLoad ? -90 : -180, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: flipOnce ? 0 : firstLoad?.firstLoad ? 90 : 180, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	return (
		<MotionCard
			id={`club-${pollData?.club_id}-poll-${pollData?.id}-page-left`}
			className="bg-page flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-shadow-dark shadow-md"
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
				if (
					!firstLoad?.firstLoad &&
					((latest.rotateY && Number(latest.rotateY) < 90) || (latest.rotateX && Number(latest.rotateX) > -90))
				) {
					firstLoad?.setFirstLoad(true)
				}
			}}
		>
			{firstLoad?.firstLoad && (
				<>
					<PollActionsButton />
					<CardHeader className="px-4 md:px-6 relative h-full pt-4 md:pt-6">
						<CardTitle className="text-md md:text-xl flex flex-row items-center">
							poll
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="size-4 md:size-6 mx-2"
							>
								<path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
							</svg>
						</CardTitle>
						<Separator />
						<CardTitle className="text-sm md:text-lg text-wrap break-words">{pollData?.name}</CardTitle>
						<CardDescription className="text-xs md:text-sm break-words">{pollData?.description}</CardDescription>
						<Separator />
						<PollPodium />
					</CardHeader>
				</>
			)}
			<div className="bg-gradient-to-l from-shadow to-page py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-page px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
