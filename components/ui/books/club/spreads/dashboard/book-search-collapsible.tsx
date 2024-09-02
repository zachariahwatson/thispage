"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, Skeleton } from "@/components/ui"
import { BookSearchItem } from "@/components/ui/books/club/spreads/dashboard"
import { FormDescription, FormItem, FormLabel } from "@/components/ui/forms"
import { Editions } from "@/lib/types"
import { MutableRefObject, useState } from "react"
import { useQuery } from "react-query"

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
	} = useQuery<Editions>({
		queryKey: ["editions", item],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/books${item.key}/editions`)
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

	// Filter the editions to only include those with 'languages' key containing '/languages/eng'
	const filteredEditions = editions?.entries.filter((entry) =>
		entry.languages?.some((language) => language.key === "/languages/eng")
	)

	return filteredEditions && filteredEditions.length > 0 ? (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
			<div className="flex items-center justify-between space-x-4">
				<CollapsibleTrigger asChild>
					<FormItem className="flex flex-row items-center space-x-3 space-y-0 w-full">
						<FormLabel className="w-full h-full cursor-pointer rounded-md border p-4 space-y-2">
							{item.title}{" "}
							<span className="italic text-muted-foreground">
								{item.author_name
									? " by " +
									  (item.author_name.length === 2
											? item.author_name.join(" and ")
											: item.author_name
													.map((author: string, i: number) => {
														if (i === item.author_name.length - 1 && item.author_name.length !== 1) {
															return "and " + author
														} else {
															return author
														}
													})
													.join(", "))
									: null}
							</span>
							<FormDescription className="flex flex-row items-center text-xs">
								view {filteredEditions.length} editions{" "}
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
				{filteredEditions.map(
					(entry: any, i: number) =>
						(entry.number_of_pages || entry.pagination) && (
							<BookSearchItem item={entry} authors={item.author_name} key={i} radioRef={radioRef} />
						)
				)}
			</CollapsibleContent>
		</Collapsible>
	) : (
		loading && <BookSearchCollapsibleSkeleton />
	)
}

export function BookSearchCollapsibleSkeleton() {
	return <Skeleton className="w-full h-20" />
}
