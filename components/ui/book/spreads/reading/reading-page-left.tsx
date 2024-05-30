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
import { Button } from "@/components/ui/buttons"
import { Interval, MemberProgress, Reading } from "@/lib/types"
import { motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

interface Props {
	interval: Interval
	readingData: Reading
	isVertical: boolean
	readingIndex: number
}

export function ReadingPageLeft({ interval, readingData, isVertical, readingIndex }: Props) {
	const MotionCard = motion(Card)

	//framer motion responsive animation (turns book page flip into notepad page flip)
	const leftVariants = isVertical
		? {
				initial: { rotateX: -90, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: 90, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	//fetch the user's progress
	const fetchUserProgress = async () => {
		const url = new URL(`http://localhost:3000/api/users/progresses/${(interval && interval?.id) || null}`)
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			const body = await response.json()
			throw new Error(body.error)
		}

		return await response.json()
	}

	const { data: userProgress, isLoading: loading } = useQuery<MemberProgress>(["user progress", interval?.id], () =>
		fetchUserProgress()
	)

	return (
		<MotionCard
			className="flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-md"
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: 0.15, delay: 0.15, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
		>
			<div className="flex justify-center px-12 pb-16 pt-8 h-full w-full">
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
								  readingData.book.authors
										.map((author, i) => {
											if (i === readingData?.book?.authors?.length ? readingData.book.authors?.length - 1 : null) {
												return author
											} else if (
												i === readingData?.book?.authors?.length ? readingData.book.authors?.length - 2 : null
											) {
												return author + " and "
											} else {
												return author + ", "
											}
										})
										.join("")
								: null)
					}
				/>
			</div>

			<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-background/90 -space-y-4 md:space-y-0 shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md bg-background/80 rounded-none rounded-t-lg md:rounded-none md:rounded-l-lg">
				<CardHeader className="pb-6 pt-4 md:py-4">
					<CardTitle className="text-xl md:text-2xl">{readingData?.book?.title}</CardTitle>
					<CardDescription className="italic">
						{readingData?.book?.authors
							? " by " +
							  readingData.book.authors
									.map((author, i) => {
										if (i === readingData?.book?.authors?.length ? readingData.book.authors?.length - 1 : null) {
											return author
										} else if (i === readingData?.book?.authors?.length ? readingData.book.authors?.length - 2 : null) {
											return author + " and "
										} else {
											return author + ", "
										}
									})
									.join("")
							: null}
					</CardDescription>
				</CardHeader>
				{userProgress && (
					<div className="px-4">
						<Separator />
					</div>
				)}
				<CardContent className="pr-0 pt-6 md:pt-2">
					{userProgress ? (
						<>
							<CardDescription>read to...</CardDescription>
							<div className="flex flex-row">
								<p className="font-bold italic">
									p. <span className="text-6xl md:text-8xl not-italic">{interval?.goal_page}</span>
								</p>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1}
									stroke="currentColor"
									className="w-12 md:w-16 h-12 md:h-16 self-center"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
								</svg>
								<div className="self-center">
									<Tooltip>
										<TooltipTrigger>
											<Button
												variant={"ghost"}
												className="w-14 md:w-16 h-14 md:h-16 p-0 rounded-full text-primary hover:text-primary"
											>
												{userProgress?.is_complete ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														fill="currentColor"
														className="w-14 md:w-16 h-14 md:h-16"
													>
														<path
															fillRule="evenodd"
															d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
															clipRule="evenodd"
														/>
													</svg>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={1.5}
														stroke="currentColor"
														className="w-14 md:w-16 h-14 md:h-16"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
														/>
													</svg>
												)}
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{userProgress?.is_complete ? "un-complete reading" : "complete reading"}</p>
										</TooltipContent>
									</Tooltip>
								</div>
							</div>
							<CardDescription className="italic">2/5 members have completed</CardDescription>
						</>
					) : (
						<div className="w-full h-full flex justify-center items-center pt-8 pr-6">
							<Button>join reading</Button>
						</div>
					)}
				</CardContent>
				<CardFooter>
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
			<div className="bg-gradient-to-l from-border to-card py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 bg-foreground/5" />
			</div>
			<div className="bg-gradient-to-t from-border to-card px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 bg-foreground/5" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{readingIndex + 1}</p>
		</MotionCard>
	)
}
