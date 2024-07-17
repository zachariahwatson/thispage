"use client"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	RadioGroup,
	RadioGroupItem,
} from "@/components/ui"
import { MutableRefObject, useRef, useState } from "react"
import { ControllerRenderProps, FormProviderProps, UseFormReturn } from "react-hook-form"
import { BookSearchList } from "./book-search-list"
import { Button } from "@/components/ui/buttons"
import { useQuery } from "react-query"
import { BookSearchItem } from "./book-search-item"

interface Props {
	item: any
	radioRef: MutableRefObject<HTMLDivElement | null>
}

export function BookSearchCollapsible({ item, radioRef }: Props) {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	//fetch the reading's intervals
	const {
		data: editions,
		isLoading: loading,
		refetch,
	} = useQuery({
		queryKey: ["editions", item],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/books${item.key}`)
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
		},
	})
	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
			<div className="flex items-center justify-between space-x-4">
				<CollapsibleTrigger asChild>
					<FormItem className="flex flex-row items-center space-x-3 space-y-0 w-full">
						<FormLabel className="w-full h-full cursor-pointer rounded-md border p-4 space-y-2">
							{item.title}{" "}
							<span className="italic text-muted-foreground">
								{item.author_name
									? " by " +
									  item.author_name.map((author: string, i: number) => {
											if (i === (item.author_name ? item.author_name.length - 1 : 0)) {
												return author
											} else if (i === (item.author_name ? item.author_name.length - 2 : 0)) {
												return author + " and "
											} else {
												return author + ", "
											}
									  })
									: null}
							</span>
							<FormDescription className="flex flex-row items-center text-xs">
								view editions{" "}
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
										d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
									/>
								</svg>
							</FormDescription>
						</FormLabel>
					</FormItem>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="space-y-2 px-4">
				{editions &&
					editions.entries &&
					editions.entries.map((entry: any, i: number) => <BookSearchItem item={entry} key={i} radioRef={radioRef} />)}
			</CollapsibleContent>
		</Collapsible>
	)
}
