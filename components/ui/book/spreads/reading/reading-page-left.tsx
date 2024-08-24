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
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui"
import {
	Button,
	JoinReadingButton,
	CompleteIntervalButton,
	ReadingActionsButton,
	ArchiveButton,
} from "@/components/ui/buttons"
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

	const startDate = new Date(readingData?.start_date || "")

	//concat user progress to intervals
	const memberProgresses = [userProgress].concat(interval?.member_interval_progresses)

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
			<div className="flex justify-center px-12 pb-16 pt-4 md:pt-8 h-full w-full">
				<Sheet>
					<SheetTrigger>
						<Image
							className="rounded-lg h-full w-auto"
							src={readingData?.book_cover_image_url || ""}
							width={readingData?.book_cover_image_width || 0}
							height={readingData?.book_cover_image_height || 0}
							alt={
								"Cover photo of " + readingData?.book_title ||
								"Unknown" +
									(readingData?.book_authors
										? " by " +
										  (readingData?.book_authors.length === 2
												? readingData?.book_authors.join(" and ")
												: readingData?.book_authors
														.map((author: string, i: number) => {
															if (
																i === (readingData?.book_authors ? readingData.book_authors?.length - 1 : 0) &&
																readingData.book_authors?.length !== 1
															) {
																return "and " + author
															} else {
																return author
															}
														})
														.join(", "))
										: null)
							}
							loading="eager"
						/>
					</SheetTrigger>
					<SheetContent className={`space-y-4 ${isVertical && "w-full"} overflow-scroll`}>
						<SheetHeader className="text-left">
							<SheetTitle>{readingData?.book_title}</SheetTitle>
							<SheetDescription className="italic">
								{readingData?.book_authors
									? "by " +
									  (readingData?.book_authors.length === 2
											? readingData?.book_authors.join(" and ")
											: readingData?.book_authors
													.map((author: string, i: number) => {
														if (
															i === (readingData?.book_authors ? readingData.book_authors?.length - 1 : 0) &&
															readingData.book_authors?.length !== 1
														) {
															return "and " + author
														} else {
															return author
														}
													})
													.join(", "))
									: null}
							</SheetDescription>
						</SheetHeader>
						<Image
							className="rounded-lg w-full max-h-full shadow-shadow shadow-md"
							src={readingData?.book_cover_image_url || ""}
							width={readingData?.book_cover_image_width || 0}
							height={readingData?.book_cover_image_height || 0}
							alt={
								"Cover photo of " + readingData?.book_title ||
								"Unknown" +
									(readingData?.book_authors
										? " by " +
										  (readingData?.book_authors.length === 2
												? readingData?.book_authors.join(" and ")
												: readingData?.book_authors
														.map((author: string, i: number) => {
															if (
																i === (readingData?.book_authors ? readingData.book_authors?.length - 1 : 0) &&
																readingData.book_authors?.length !== 1
															) {
																return "and " + author
															} else {
																return author
															}
														})
														.join(", "))
										: null)
							}
							loading="eager"
						/>
						<SheetDescription className="italic">{readingData?.book_description}</SheetDescription>
					</SheetContent>
				</Sheet>
			</div>

			<ReadingActionsButton />

			<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-background/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md bg-background/80 rounded-none rounded-t-lg md:rounded-none md:rounded-l-lg">
				<CardHeader className="pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4">
					<CardTitle className="text-xl md:text-2xl">{readingData?.book_title}</CardTitle>
					<CardDescription className="italic">
						{readingData?.book_authors
							? " by " +
							  (readingData?.book_authors.length === 2
									? readingData?.book_authors.join(" and ")
									: readingData?.book_authors
											.map((author: string, i: number) => {
												if (
													i === (readingData?.book_authors ? readingData.book_authors?.length - 1 : 0) &&
													readingData.book_authors?.length !== 1
												) {
													return "and " + author
												} else {
													return author
												}
											})
											.join(", "))
							: null}
					</CardDescription>
				</CardHeader>
				{!userProgressLoading && (
					<div className="px-4">
						<Separator />
					</div>
				)}
				<CardContent className="pr-0 pt-6 md:pt-2 md:px-6 px-4">
					{!readingData?.is_finished ? (
						startDate.getTime() > Date.now() ? (
							<div className="w-full h-full flex justify-center items-center pt-8 pr-6">
								<p className="text-muted-foreground">
									🚧this reading will start on{" "}
									{startDate.toLocaleDateString(undefined, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
									🚧
								</p>
							</div>
						) : userProgressLoading ? (
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
						) : (
							userProgress && (
								<>
									<CardDescription>read to...</CardDescription>
									<div className="flex flex-row">
										{readingData?.increment_type === "pages" ? (
											<p className="font-bold italic md:text-xl">
												p.
												<span className="text-6xl md:text-8xl not-italic">{interval?.goal_page}</span>
											</p>
										) : (
											<p className="font-bold italic md:text-xl">
												{readingData?.section_name}
												<span className="text-6xl md:text-8xl not-italic">{interval?.goal_section}</span>
											</p>
										)}

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
											<CompleteIntervalButton readingId={readingData?.id || null} intervalId={interval?.id || null} />
										</div>
									</div>
									<CardDescription className="italic">
										{memberProgresses.filter((progress) => progress?.is_complete).length}/{memberProgresses.length}{" "}
										readers have completed
									</CardDescription>
								</>
							)
						)
					) : (
						<div className="w-full h-full flex justify-center items-center pt-8 pr-6">
							<p className="text-muted-foreground">🎉reading finished!🎉</p>
						</div>
					)}
					<div className="w-full h-full flex justify-center items-center pt-8 pr-6 space-x-2">
						{!userProgress &&
							(!readingData?.join_in_progress && new Date().getTime() > startDate.getTime() ? (
								<p className="text-muted-foreground">sorry, this reading has already started :(</p>
							) : (
								<JoinReadingButton readingId={readingData?.id || null} intervalId={interval?.id || null} />
							))}
						{clubMembership?.role === "admin" && readingData?.is_finished && <ArchiveButton />}
					</div>
				</CardContent>
				<CardFooter className="md:px-6 px-4">
					{userProgress && readingData?.increment_type === "pages" ? (
						interval?.goal_page && readingData?.book_page_count ? (
							<Progress
								value={
									!readingData.is_finished
										? Math.floor(
												((interval?.goal_page - readingData.interval_page_length) / readingData?.book_page_count) * 100
										  )
										: 100
								}
								className="h-2 md:h-4"
							/>
						) : (
							<></>
						)
					) : interval?.goal_section && readingData?.book_sections ? (
						<Progress
							value={
								!readingData.is_finished
									? Math.floor(
											((interval?.goal_section - readingData.interval_section_length) / readingData?.book_sections) *
												100
									  )
									: 100
							}
							className="h-2 md:h-4"
						/>
					) : (
						<></>
					)}
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
