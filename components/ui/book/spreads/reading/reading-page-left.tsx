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
import { Button, JoinReadingButton, CompleteIntervalButton } from "@/components/ui/buttons"
import { useClubMembership, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { Interval, MemberProgress, Reading } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

interface Props {
	readingIndex: number
}

export function ReadingPageLeft({ readingIndex }: Props) {
	const MotionCard = motion(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(false)
	const readingData = useReading()
	const clubMembership = useClubMembership()
	const isVertical = useMediaQuery("(max-width: 768px)")

	const { data: intervals } = useIntervals(clubMembership?.club.id || null, readingData?.id || null)

	const interval = (intervals && intervals[0]) || null

	const { data: userProgress, isLoading: userProgressLoading } = useUserProgress(
		interval?.id || null,
		clubMembership?.id || null
	)

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
			transition={{ type: "tween", duration: 0.15, delay: 0.15, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
			onAnimationComplete={() => setFlipOnce(true)}
		>
			<div className="flex justify-center px-12 pb-16 pt-4 md:pt-8 h-full w-full">
				<Image
					className="rounded-lg h-full w-auto"
					src={readingData?.book?.cover_image_url || ""}
					width={readingData?.book?.cover_image_width || 0}
					height={readingData?.book?.cover_image_height || 0}
					alt={
						"Cover photo of " + readingData?.book?.title ||
						"Unknown" +
							(readingData?.book?.authors
								? " by " +
								  readingData.book.authors.map((author, i) => {
										if (i === (readingData?.book?.authors ? readingData.book.authors?.length - 1 : 0)) {
											return author
										} else if (i === (readingData?.book?.authors ? readingData.book.authors?.length - 2 : 0)) {
											return author + " and "
										} else {
											return author + ", "
										}
								  })
								: null)
					}
				/>
			</div>

			<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-background/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md bg-background/80 rounded-none rounded-t-lg md:rounded-none md:rounded-l-lg">
				<CardHeader className="pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4">
					<CardTitle className="text-xl md:text-2xl">{readingData?.book?.title}</CardTitle>
					<CardDescription className="italic">
						{readingData?.book?.authors
							? " by " +
							  readingData.book.authors.map((author, i) => {
									if (i === (readingData?.book?.authors ? readingData.book.authors?.length - 1 : 0)) {
										return author
									} else if (i === (readingData?.book?.authors ? readingData.book.authors?.length - 2 : 0)) {
										return author + " and "
									} else {
										return author + ", "
									}
							  })
							: null}
					</CardDescription>
				</CardHeader>
				{!userProgressLoading && (
					<div className="px-4">
						<Separator />
					</div>
				)}
				<CardContent className="pr-0 pt-6 md:pt-2 md:px-6 px-4">
					{userProgressLoading ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6 animate-spin"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					) : userProgress ? (
						<>
							<CardDescription>read to...</CardDescription>
							<div className="flex flex-row">
								<p className="font-bold italic md:text-xl">
									p.<span className="text-6xl md:text-8xl not-italic">{interval?.goal_page}</span>
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
									{/**
									 * @todo add dialog box confirming if the user wants to complete the reading if they're the last member to do so
									 */}
									<CompleteIntervalButton intervalId={interval?.id || null} />
								</div>
							</div>
							<CardDescription className="italic">
								{interval?.member_interval_progresses.filter((progress) => progress.is_complete).length}/
								{interval?.member_interval_progresses.length} readers have completed
							</CardDescription>
						</>
					) : (
						/**
						 * @todo do something with useOptimistic -
						 */
						<JoinReadingButton readingId={readingData?.id || null} intervalId={interval?.id || null} />
					)}
				</CardContent>
				<CardFooter className="md:px-6 px-4">
					{userProgress && interval?.goal_page && readingData?.book?.page_count ? (
						<Progress
							value={Math.floor((interval?.goal_page / readingData?.book?.page_count) * 100)}
							className="h-2 md:h-4"
						/>
					) : (
						<></>
					)}
				</CardFooter>
			</Card>
			<div className="bg-gradient-to-l from-shadow to-background py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 bg-shadow-dark" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-background px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 bg-shadow-dark" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{readingIndex + 1}</p>
		</MotionCard>
	)
}
