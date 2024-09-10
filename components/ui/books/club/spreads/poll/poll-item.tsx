"use client"

import {
	BookDetails,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox,
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
	ToggleGroupItem,
} from "@/components/ui"
import { PollItemActionsButton } from "@/components/ui/buttons"
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
		creator_member_id: number | null
		poll_votes: {
			id: number
			member_id: number
			poll_item_id: number
		}[]
	}
	groupValues: string[] | undefined
}

export function PollItem({ item, groupValues }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const pollData = usePoll()
	const totalVotes = pollData?.items.reduce((total, item) => total + item.poll_votes.length, 0)
	const clubMembership = useClubMembership()
	const cardRef = useRef<HTMLDivElement>(null)
	const cardHeaderRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const card = cardRef.current
		const image = imageRef.current
		const cardHeader = cardHeaderRef.current

		if (card && image && cardHeader) {
			const observer = new ResizeObserver(() => {
				const h = `${Math.floor(card.clientHeight)}px`
				const w = `${Math.floor(card.clientWidth)}px`
				image.style.height = h
				cardHeader.style.width = w
			})

			observer.observe(card)

			return () => observer.disconnect()
		}
	}, [cardRef, imageRef])

	return (
		<div className="relative">
			{(clubMembership?.id === item.creator_member_id || clubMembership?.role !== "member") &&
				pollData?.status === "selection" && <PollItemActionsButton name={item.book_title} pollItemId={item.id} />}
			<div
				className={`relative flex flex-row items-center rounded-lg border bg-card text-card-foreground shadow-shadow shadow-sm pl-4 transition-all ${
					groupValues?.includes(item.id.toString()) && "ring-2 ring-ring"
				}`}
			>
				<ToggleGroupItem
					value={`${item.id}`}
					id={`${item.id}`}
					hidden
					className="bg-none p-0 m-0 "
					disabled={pollData?.user_votes && pollData?.user_votes.length > 0}
				>
					{pollData?.status !== "voting" || pollData.user_votes.length > 0 ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="size-4 text-muted-foreground"
						>
							<path
								fillRule="evenodd"
								d="M3.05 3.05a7 7 0 1 1 9.9 9.9 7 7 0 0 1-9.9-9.9Zm1.627.566 7.707 7.707a5.501 5.501 0 0 0-7.707-7.707Zm6.646 8.768L3.616 4.677a5.501 5.501 0 0 0 7.707 7.707Z"
								clipRule="evenodd"
							/>
						</svg>
					) : (
						<Checkbox className="w-4 h-4 p-0 rounded-[4px]" checked={groupValues?.includes(item.id.toString())} />
					)}
				</ToggleGroupItem>

				<p className="absolute bottom-1 text-xs text-muted-foreground left-2">
					{pollData?.user_votes.length === 0
						? "?%"
						: `${totalVotes ? Math.trunc((item?.poll_votes.length / totalVotes) * 100) : 0}%`}
				</p>
				<Card ref={cardRef} className="w-full min-w-0 rounded-none border-none bg-none shadow-none">
					<Label htmlFor={`${item.id}`} className="hover:cursor-pointer min-w-0">
						<CardHeader ref={cardHeaderRef} className="relative p-2 md:p-3 pb-1 md:pb-2 space-y-0">
							<CardTitle className="text-md truncate ..." title={item.book_title}>
								{item.book_title}
							</CardTitle>
							<CardDescription
								className="text-xs md:text-sm truncate ..."
								title={
									item.book_authors
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
										: undefined
								}
							>
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
							value={pollData?.user_votes.length === 0 ? 0 : totalVotes && (item?.poll_votes.length / totalVotes) * 100}
							className="h-2 mb-2 ml-4 w-[calc(100%-1.5rem)]"
						/>
					</Label>
				</Card>
				{cardRef && (
					<Sheet>
						<div ref={imageRef} className="flex items-center relative justify-end pr-6">
							<SheetTrigger asChild>
								{item.book_cover_image_width === 1 && item.book_cover_image_width === 1 ? (
									<div className="max-h-full h-full w-8 float-right rounded-[4px] flex justify-center items-center text-muted-foreground hover:cursor-pointer">
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
										className="max-h-full w-auto h-auto float-right rounded-[4px] shadow-sm shadow-shadow object-contain hover:ring-4 hover:ring-ring transition-all hover:cursor-pointer"
									/>
								)}
							</SheetTrigger>
						</div>

						<BookDetails
							bookTitle={item.book_title}
							coverUrl={item.book_cover_image_url ?? ""}
							coverWidth={item.book_cover_image_width ?? 0}
							coverHeight={item.book_cover_image_height ?? 0}
							authors={item.book_authors ?? undefined}
							description={item.book_description ?? undefined}
						/>
					</Sheet>
				)}
			</div>
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
