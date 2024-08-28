"use client"

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	Label,
	Progress,
	RadioGroupItem,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Skeleton,
} from "@/components/ui"
import { useClubMembership, usePoll, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useClubs } from "@/hooks/state"
import { Poll } from "@/lib/types"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface Props {
	item: {
		id: number
		created_at: string
		book_title: string
		book_description: string | null
		book_authors: string[] | null
		book_page_count: number
		book_cover_image_url: string | null
		book_cover_image_width: number | null
		book_cover_image_height: number | null
		votes_count: number
	}
}

export function PollItem({ item }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const pollData = usePoll()
	const cardRef = useRef<HTMLDivElement | null>(null)
	const cardHeaderRef = useRef<HTMLDivElement | null>(null)
	const imageRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		// Update cardHeight whenever the card is rendered or resized
		if (cardRef.current && imageRef.current && cardHeaderRef.current) {
			imageRef.current.style.height = `${cardRef.current.offsetHeight}px`
			cardHeaderRef.current.style.width = `${cardRef.current.offsetWidth}px`
		}
	}, [cardRef, cardHeaderRef, imageRef])

	// const { data: userLikes } = useLikes({ memberId: String(clubMembership?.id) })
	// // check if user has already liked the post or comment
	// const hasLiked = userLikes?.find((like: Like) => like.post_id === Number(id) && id !== undefined)
	return (
		<div className="flex flex-row items-center">
			<RadioGroupItem value={`${item.id}`} id={`${item.id}`} className="mr-2" />
			<Card ref={cardRef} className="w-full rounded-sm min-w-0 rounded-r-none border-r-0">
				<Label htmlFor={`${item.id}`} className="w-full hover:cursor-pointer min-w-0">
					<CardHeader ref={cardHeaderRef} className="w-16 relative p-2 md:p-4 pb-1 md:pb-2 space-y-0">
						<CardTitle className="text-md truncate ...">{item.book_title}</CardTitle>
						<CardDescription className="text-xs md:text-sm truncate ...">
							{item.book_authors
								? " by " +
								  (item.book_authors.length === 2
										? item.book_authors.join(" and ")
										: item.book_authors
												.map((author: string, i: number) => {
													if (
														i === (item.book_authors ? item.book_authors?.length - 1 : 0) &&
														item.book_authors?.length !== 1
													) {
														return "and " + author
													} else {
														return author
													}
												})
												.join(", "))
								: null}
						</CardDescription>
						<CardDescription className="text-xs md:text-sm truncate ...">
							{item.book_page_count || "?"} pages
						</CardDescription>
					</CardHeader>
					<Progress
						value={pollData?.total_votes_count && (item.votes_count / pollData?.total_votes_count) * 100}
						className="h-2 mb-2 mx-2 md:mx-4 w-[calc(100%-1rem)] md:w-[calc(100%-2rem)]"
					/>
				</Label>
			</Card>

			<Sheet>
				<SheetTrigger>
					<div
						ref={imageRef}
						className="flex items-center relative justify-end py-1 pr-4 border-border border-[1px] border-l-0 rounded-r-md bg-card"
					>
						{item.book_cover_image_width === 1 && item.book_cover_image_width === 1 ? (
							<div className="max-h-full h-full w-8 float-right rounded-[4px] flex justify-center items-center text-muted-foreground">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6 hover:ring-4 hover:ring-ring transition-all rounded-[4px]"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
									/>
								</svg>
							</div>
						) : (
							<Image
								src={item.book_cover_image_url || ""}
								width={item.book_cover_image_width || 0}
								height={item.book_cover_image_height || 0}
								alt={
									"Cover photo of " + item.book_title ||
									"Unknown" +
										(item.book_authors
											? " by " +
											  (item.book_authors.length === 2
													? item.book_authors.join(" and ")
													: item.book_authors
															.map((author: string, i: number) => {
																if (
																	i === (item.book_authors ? item.book_authors?.length - 1 : 0) &&
																	item.book_authors?.length !== 1
																) {
																	return "and " + author
																} else {
																	return author
																}
															})
															.join(", "))
											: null)
								}
								className="max-h-full w-auto float-right rounded-[4px] shadow-sm shadow-shadow object-contain hover:ring-4 hover:ring-ring transition-all"
							/>
						)}
						{/* <svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6 absolute text-muted-foreground bg-card rounded-full top-1 right-1"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
							/>
						</svg> */}
					</div>
				</SheetTrigger>
				<SheetContent className={`space-y-4 ${isVertical && "w-full"} overflow-scroll`}>
					<SheetHeader className="text-left">
						<SheetTitle>{item?.book_title}</SheetTitle>
						<SheetDescription className="italic">
							{item.book_authors
								? " by " +
								  (item.book_authors.length === 2
										? item.book_authors.join(" and ")
										: item.book_authors
												.map((author: string, i: number) => {
													if (
														i === (item.book_authors ? item.book_authors?.length - 1 : 0) &&
														item.book_authors?.length !== 1
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
					{item.book_cover_image_width === 1 && item.book_cover_image_width === 1 ? (
						<div className="rounded-lg w-full max-h-full flex justify-center items-center text-muted-foreground">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
								/>
							</svg>
						</div>
					) : (
						<Image
							src={item.book_cover_image_url || ""}
							width={item.book_cover_image_width || 0}
							height={item.book_cover_image_height || 0}
							alt={
								"Cover photo of " + item.book_title ||
								"Unknown" +
									(item.book_authors
										? " by " +
										  (item.book_authors.length === 2
												? item.book_authors.join(" and ")
												: item.book_authors
														.map((author: string, i: number) => {
															if (
																i === (item.book_authors ? item.book_authors?.length - 1 : 0) &&
																item.book_authors?.length !== 1
															) {
																return "and " + author
															} else {
																return author
															}
														})
														.join(", "))
										: null)
							}
							className="rounded-lg w-full max-h-full shadow-shadow shadow-md"
						/>
					)}
					<SheetDescription className="italic">{item?.book_description}</SheetDescription>
				</SheetContent>
			</Sheet>
		</div>
	)
}

export function PollItemSkeleton() {
	return (
		<>
			<div className="flex flex-row">
				<Skeleton className="w-2/3 h-[22px]" />
				<Skeleton className="w-[50px] h-[22px] shrink-0 ml-auto" />
			</div>
			<Separator className="my-2" />
		</>
	)
}
