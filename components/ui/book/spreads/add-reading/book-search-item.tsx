"use client"
import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	RadioGroup,
	RadioGroupItem,
	Skeleton,
} from "@/components/ui"
import { MutableRefObject, useRef, useState } from "react"
import { ControllerRenderProps, FormProviderProps, UseFormReturn } from "react-hook-form"
import { BookSearchList } from "./book-search-list"
import { Button } from "@/components/ui/buttons"
import Image from "next/image"
import { useQuery } from "react-query"

interface Props {
	item: any
	authors?: string[]
	radioRef: MutableRefObject<HTMLDivElement | null>
}

export function BookSearchItem({ item, authors, radioRef }: Props) {
	const [coverLoading, setCoverLoading] = useState<boolean>(true)
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	//fetch the item's cover info
	const {
		data: cover,
		isLoading: loading,
		isError: error,
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
	return (
		/**
		 * @todo create loading skeleton for whole entry, you don't want people selecting items before the cover info is loaded
		 */
		<FormItem className="flex flex-row items-center space-x-3 space-y-0">
			<FormControl>
				<RadioGroupItem
					value={JSON.stringify({
						openLibraryId: item.key.split("/")[2],
						title: item.title || "",
						description: item.description || "",
						authors: authors,
						pageCount: Number(item.number_of_pages || item.pagination),
						coverImageUrl: !loading && cover && `https://covers.openlibrary.org/b/id/${cover.id}-L.jpg`,
						coverImageWidth: !loading && cover && cover.width,
						coverImageHeight: !loading && cover && cover.height,
					})}
				/>
			</FormControl>
			<FormLabel className={`w-full h-full cursor-pointer`}>
				<Card>
					<CardHeader className="relative">
						<div className="w-1/2">
							{item.title}
							<CardDescription>
								{item.publishers && item.publishers[0]}, {item.publish_date && item.publish_date}
							</CardDescription>
							<CardDescription>{item.number_of_pages || item.pagination || "?"} pages</CardDescription>
							<div className="flex flex-row items-center space-x-2">
								{item.languages &&
									item.languages.map((language: any, i: number) => (
										<Badge variant="outline" key={i}>
											{language.key.split("/")[2]}
										</Badge>
									))}
							</div>
							<div className="absolute right-0 top-0 h-full p-4 max-w-full">
								{loading && coverLoading ? (
									<Skeleton className={`max-h-full h-full w-16 float-right rounded-[4px] shadow-sm shadow-shadow`} />
								) : cover && cover.id && cover.width && cover.height ? (
									<Image
										src={`https://covers.openlibrary.org/b/id/${cover.id}-M.jpg`}
										width={cover.width}
										height={cover.height}
										alt="cover"
										className="max-h-full w-auto float-right rounded-[4px] shadow-sm shadow-shadow"
										onLoad={() => setCoverLoading(false)}
									/>
								) : (
									<div className="max-h-full h-full w-16 float-right rounded-[4px] flex justify-center items-center text-muted-foreground">
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
								)}
							</div>
						</div>
					</CardHeader>
				</Card>
			</FormLabel>
		</FormItem>
	)
}
