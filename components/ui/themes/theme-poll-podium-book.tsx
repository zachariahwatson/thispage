"use client"

import {
	BookDetails,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import { useMediaQuery } from "@/hooks"
import Image from "next/image"
import { MutableRefObject, useEffect, useRef } from "react"

interface Props {
	flexBoxRef: MutableRefObject<HTMLDivElement | null>
	item?: {
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
		percent: number
		creator_member_id: number | null
		poll_votes: {
			id: number
			poll_item_id: number
		}[]
	} | null
	winner?: boolean | undefined
}

export function ThemePollPodiumBook({ flexBoxRef, item, winner }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const imageRef = useRef<HTMLImageElement | null>(null)
	const divRef = useRef<HTMLDivElement | null>(null)

	// useEffect(() => {
	// 	// Update cardHeight whenever the card is rendered or resized
	// 	if (flexBoxRef.current) {
	// 		const h = `${Math.floor(flexBoxRef.current.clientHeight / 2) - (isVertical ? 8 : 16)}px`
	// 		const w = `${Math.floor(flexBoxRef.current.clientHeight / 3.33)}px`
	// 		if (imageRef.current) imageRef.current.style.maxHeight = h

	// 		if (divRef.current) {
	// 			divRef.current.style.height = h
	// 			divRef.current.style.width = w
	// 		}
	// 	}
	// }, [flexBoxRef, imageRef, divRef])

	useEffect(() => {
		const flexBox = flexBoxRef.current
		const image = imageRef.current
		const div = divRef.current

		if (flexBox) {
			const observer = new ResizeObserver(() => {
				const h = `${Math.floor(flexBox.clientHeight / 2) - (isVertical ? 8 : 16)}px`
				const w = `${Math.floor(flexBox.clientHeight / 3.33)}px`
				if (image) image.style.maxHeight = h
				if (div) {
					div.style.height = h
					div.style.width = w
				}
			})

			observer.observe(flexBox)

			return () => observer.disconnect()
		}
	}, [])

	return item ? (
		<Sheet>
			<SheetTrigger asChild>
				{item?.book_cover_image_width === 1 && item?.book_cover_image_width === 1 ? (
					<div
						ref={divRef}
						className={`absolute max-w-[calc(100%-1rem)] bottom-[calc(100%+.5rem)] md:bottom-[calc(100%+1rem)] rounded-[4px] md:rounded-sm ${
							winner ? "shadow-xl shadow-primary" : "shadow-lg shadow-shadow"
						} hover:cursor-pointer text-muted-foreground flex justify-center items-center border-border border-[1px] bg-card`}
					>
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
						ref={imageRef}
						src={item?.book_cover_image_url || ""}
						width={item?.book_cover_image_width || 0}
						height={item?.book_cover_image_height || 0}
						alt={
							"Cover photo of " + item?.book_title ||
							"Unknown" +
								(item?.book_authors
									? " by " +
									  (item?.book_authors.length === 2
											? item?.book_authors.join(" and ")
											: item?.book_authors
													.map((author: string, i: number) => {
														if (
															i === (item?.book_authors ? item?.book_authors?.length - 1 : 0) &&
															item?.book_authors?.length !== 1
														) {
															return "and " + author
														} else {
															return author
														}
													})
													.join(", "))
									: null)
						}
						className={`absolute max-w-[calc(100%-1rem)] w-auto h-auto bottom-[calc(100%+.5rem)] md:bottom-[calc(100%+1rem)] rounded-[4px] md:rounded-sm object-contain  ${
							winner ? "shadow-xl shadow-primary" : "shadow-lg shadow-shadow"
						} hover:cursor-pointer`}
					/>
				)}
			</SheetTrigger>

			<BookDetails
				bookTitle={item.book_title}
				coverUrl={item.book_cover_image_url ?? ""}
				coverWidth={item.book_cover_image_width ?? 0}
				coverHeight={item.book_cover_image_height ?? 0}
				authors={item.book_authors ?? undefined}
				description={item.book_description ?? undefined}
			/>
		</Sheet>
	) : (
		<div className="absolute bottom-full">{["🐌", "🐛", "🦗", "🐜", "🐝"][Math.floor(Math.random() * 4.99)]}</div>
	)
}
