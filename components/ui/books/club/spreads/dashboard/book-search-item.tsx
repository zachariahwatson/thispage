"use client"
import {
	Badge,
	BookDetails,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	RadioGroupItem,
	Sheet,
	SheetTrigger,
	Skeleton,
} from "@/components/ui"
import { FormControl, FormItem, FormLabel } from "@/components/ui/forms"
import { useMediaQuery } from "@/hooks"
import { Editions, Work } from "@/lib/types"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"

interface Props {
	work: Work
	item: Editions["entries"][number]
	authors?: string[]
	groupValue: string | undefined
}

export function BookSearchItem({ work, item, authors, groupValue }: Props) {
	const [coverLoading, setCoverLoading] = useState<boolean>(true)
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"
	const cardRef = useRef<HTMLDivElement | null>(null)
	const cardHeaderRef = useRef<HTMLDivElement | null>(null)
	const imageRef = useRef<HTMLDivElement | null>(null)
	const isVertical = useMediaQuery("(max-width: 768px)")
	//console.log(work)

	//fetch the item's cover info
	const {
		data: cover,
		isLoading: loading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["covers", item.key.split("/")[2]],
		queryFn: async () => {
			if (item.covers) {
				const url = new URL(`${defaultUrl}/api/books/cover/${item.covers[0]}`)
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
			return {}
		},
	})

	useEffect(() => {
		const card = cardRef.current
		const image = imageRef.current
		const cardHeader = cardHeaderRef.current

		if (card && cardHeader) {
			const observer = new ResizeObserver(() => {
				const h = `${Math.floor(card.clientHeight)}px`
				const w = `${Math.floor(card.clientWidth)}px`
				if (image) image.style.height = h
				cardHeader.style.width = w
			})

			observer.observe(card)

			return () => observer.disconnect()
		}
	}, [cardRef.current, imageRef.current])

	return (
		/**
		 * @todo create loading skeleton for whole entry, you don't want people selecting items before the cover info is loaded
		 */
		<FormItem className="flex flex-row items-center space-x-3 space-y-0 w-full">
			<div
				className={`w-full relative flex flex-row items-center rounded-lg border bg-card text-card-foreground shadow-shadow shadow-sm pl-4 transition-all pb-1 ${
					groupValue ===
						`${JSON.stringify({
							openLibraryId: item.key.split("/")[2],
							title: item.title || work.title,
							description:
								(item.description &&
									(typeof item.description === "object" && "value" in item.description
										? item.description.value
										: item.description)) ||
								(work.description &&
									(typeof work.description === "object" && "value" in work.description
										? work.description.value
										: work.description)),
							authors: authors,
							pageCount: item.number_of_pages ? Number(item.number_of_pages) : 0,
							coverImageUrl: !loading && cover && `https://covers.openlibrary.org/b/id/${cover.id}-L.jpg`,
							coverImageWidth: !loading && cover && cover.width,
							coverImageHeight: !loading && cover && cover.height,
						})}` && "ring-4 ring-ring"
				}`}
			>
				{!error ? (
					!loading ? (
						<FormControl>
							<RadioGroupItem
								value={JSON.stringify({
									openLibraryId: item.key.split("/")[2],
									title: item.title || work.title,
									description:
										(item.description &&
											(typeof item.description === "object" && "value" in item.description
												? item.description.value
												: item.description)) ||
										(work.description &&
											(typeof work.description === "object" && "value" in work.description
												? work.description.value
												: work.description)),
									authors: authors,
									pageCount: item.number_of_pages ? Number(item.number_of_pages) : 0,
									coverImageUrl: !loading && cover && `https://covers.openlibrary.org/b/id/${cover.id}-L.jpg`,
									coverImageWidth: !loading && cover && cover.width,
									coverImageHeight: !loading && cover && cover.height,
								})}
							/>
						</FormControl>
					) : (
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
					)
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-4 text-destructive"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
						/>
					</svg>
				)}

				<Card ref={cardRef} className="w-full min-w-0 rounded-none border-none bg-none shadow-none">
					<FormLabel className="hover:cursor-pointer min-w-0">
						<CardHeader ref={cardHeaderRef} className="relative p-2 md:p-3 pb-1 md:pb-2 space-y-0">
							<CardTitle className="text-md">{item.title}</CardTitle>
							<CardDescription>
								{item.publishers && item.publishers[0]}, {item.publish_date && item.publish_date}
							</CardDescription>
							<CardDescription>{item.number_of_pages || "?"} pages</CardDescription>
							<div className="flex flex-row items-center space-x-2">
								{item.languages &&
									item.languages.map((language: any, i: number) => (
										<Badge variant="outline" key={i}>
											{language.key.split("/")[2]}
										</Badge>
									))}
							</div>
						</CardHeader>
					</FormLabel>
				</Card>

				<Sheet>
					<div ref={imageRef} className="flex items-center relative justify-end py-1 pl-0 pr-4">
						<SheetTrigger asChild>
							{!error ? (
								(loading && coverLoading) || !cardRef ? (
									<div className="max-h-full h-full w-8 float-right rounded-[4px] flex justify-center items-center text-muted-foreground">
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
									</div>
								) : cover && cover.id && cover.width && cover.height ? (
									<Image
										src={`https://covers.openlibrary.org/b/id/${cover.id}-M.jpg`}
										width={cover.width}
										height={cover.height}
										alt={
											"Cover photo of " + item.title ||
											"Unknown" +
												(authors
													? " by " +
													  (authors.length === 2
															? authors.join(" and ")
															: authors
																	.map((author: string, i: number) => {
																		if (i === authors.length - 1 && authors.length !== 1) {
																			return "and " + author
																		} else {
																			return author
																		}
																	})
																	.join(", "))
													: null)
										}
										onLoad={() => setCoverLoading(false)}
										className="max-h-full w-auto h-auto float-right rounded-[4px] shadow-sm shadow-shadow object-contain hover:ring-4 hover:ring-ring transition-all hover:cursor-pointer"
									/>
								) : (
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
												d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
											/>
										</svg>
									</div>
								)
							) : (
								<div
									className="max-h-full h-full w-8 float-right rounded-[4px] flex justify-center items-center text-muted-foreground hover:cursor-pointer"
									onClick={(e) => {
										e.preventDefault()
										refetch()
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6 hover:ring-4 hover:ring-ring transition-all rounded-[4px] text-destructive"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
										/>
									</svg>
								</div>
							)}
						</SheetTrigger>
					</div>

					<BookDetails
						bookTitle={item.title || work.title}
						coverUrl={cover && `https://covers.openlibrary.org/b/id/${cover.id}-M.jpg`}
						coverWidth={cover && cover.width}
						coverHeight={cover && cover.height}
						authors={authors}
						description={
							(item.description &&
								(typeof item.description === "object" && "value" in item.description
									? item.description.value
									: item.description)) ||
							(work.description &&
								(typeof work.description === "object" && "value" in work.description
									? work.description.value
									: work.description))
						}
					/>
				</Sheet>
			</div>
		</FormItem>
	)
}
