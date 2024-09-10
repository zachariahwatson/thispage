import React from "react"
import { useEffect, useState, useCallback } from "react"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Label,
	RadioGroup,
	RadioGroupItem,
	Skeleton,
} from "@/components/ui"
import { BookSearchItem } from "@/components/ui/books/club/spreads/dashboard"
import { Button } from "@/components/ui/buttons"
import { FormDescription, FormItem, FormLabel } from "@/components/ui/forms"
import { Editions, Work } from "@/lib/types"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery, useQuery } from "react-query"

interface Props {
	item: any
	groupValue: string | undefined
	language:
		| {
				name: string
				key: string
				count: number
		  }
		| undefined
}

export function BookSearchCollapsible({ item, groupValue, language }: Props) {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [sort, setSort] = useState<string | undefined>()
	const [sortedEditions, setSortedEditions] = useState<Editions[] | undefined>()
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	const { ref, inView, entry } = useInView()

	const {
		data: editions,
		isFetching: loading,
		isFetchingNextPage: loadingNext,
		refetch,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery<Editions>({
		queryKey: ["editions", item],
		queryFn: async ({ pageParam }) => {
			const url = new URL(`${defaultUrl}/api/books${item.key}/editions?${pageParam}`)
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
		getNextPageParam: (lastPage, pages) =>
			lastPage && lastPage.links.next ? lastPage.links.next.split("&")[1] : undefined,
		enabled: isOpen,
	})

	// Fetch the work info
	const {
		data: work,
		isLoading: workLoading,
		isError: error,
	} = useQuery<Work>({
		queryKey: ["works", item.key.split("/")[2]],
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

	// Sort function for editions
	const sortEditions = (entries: Editions["entries"]): Editions["entries"] => {
		if (!sort) return entries

		return entries.sort((a, b) => {
			const dateA = new Date(a.publish_date?.slice(-4) ?? "").getTime()
			const dateB = new Date(b.publish_date?.slice(-4) ?? "").getTime()

			const validDateA = isNaN(dateA) ? 0 : dateA
			const validDateB = isNaN(dateB) ? 0 : dateB

			if (sort === "publisher date (newest)") {
				return validDateB - validDateA // Descending order (newest first)
			}
			if (sort === "publisher date (oldest)") {
				return validDateA - validDateB // Ascending order (oldest first)
			}
			return 0
		})
	}

	useEffect(() => {
		if (!sort) {
			setSortedEditions(editions?.pages)
		} else if (editions?.pages) {
			const allEntries = editions?.pages.flatMap((page) => page.entries) || []

			setSortedEditions([
				{
					links: editions?.pages[editions?.pages.length - 1].links,
					size: editions?.pages.length,
					entries: sortEditions(allEntries),
				},
			])
		}
	}, [sort, editions?.pages])

	// Function to continue fetching pages if no results after filtering
	const handleFetchNextPage = useCallback(async () => {
		let currentPage = 0
		let resultsFound = false

		while (hasNextPage && !resultsFound) {
			const nextPage = await fetchNextPage()

			if (
				nextPage.data?.pages[currentPage].entries.some((entry) =>
					entry.languages?.some((l) => !language || (l.key === language?.key && entry.number_of_pages))
				)
			) {
				resultsFound = true
			} else if (hasNextPage) {
				currentPage++
			}
		}
	}, [fetchNextPage, hasNextPage, language])

	useEffect(() => {
		if (inView && hasNextPage) {
			handleFetchNextPage()
		}
	}, [inView, handleFetchNextPage, hasNextPage])

	useEffect(() => {
		setIsOpen(false)
	}, [language])

	return work ? (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
			<div className="flex items-center justify-between space-x-4">
				<FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 w-full rounded-md border ">
					<CollapsibleTrigger asChild>
						<FormLabel className="w-full h-full cursor-pointer p-4 space-y-2">
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
								view editions{" "}
								{!loading ? (
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
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6 animate-spin ml-2"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
										/>
									</svg>
								)}
							</FormDescription>
						</FormLabel>
					</CollapsibleTrigger>
					<RadioGroup className="flex flex-row space-x-2 pr-4" value={sort} onValueChange={setSort}>
						<RadioGroupItem value="publisher date (oldest)" id={`publisher date (oldest) ${item.key}`} hidden />
						<Label
							htmlFor={`publisher date (oldest) ${item.key}`}
							className={`${sort === "publisher date (oldest)" && "text-primary"} hover:cursor-pointer`}
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
									d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
								/>
							</svg>
						</Label>
						<RadioGroupItem value="publisher date (newest)" id={`publisher date (newest) ${item.key}`} hidden />
						<Label
							htmlFor={`publisher date (newest) ${item.key}`}
							className={`${sort === "publisher date (newest)" && "text-primary"} hover:cursor-pointer`}
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
									d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
								/>
							</svg>
						</Label>
					</RadioGroup>
				</FormItem>
			</div>
			<CollapsibleContent className="space-y-2 pl-4">
				{editions &&
					sortedEditions?.map(
						(group: Editions) =>
							group &&
							group.entries
								.filter((entry: Editions["entries"][number]) =>
									entry.languages?.some((l) => !language || l.key === language?.key)
								)
								.map((entry: Editions["entries"][number]) => (
									<BookSearchItem
										work={work}
										item={entry}
										authors={item.author_name}
										key={entry.key}
										groupValue={groupValue}
									/>
								))
					)}
				{hasNextPage &&
					(loadingNext ? (
						<Button disabled className="w-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6 animate-spin mr-2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
							loading...
						</Button>
					) : (
						<Button className="w-full" onClick={handleFetchNextPage}>
							load more
						</Button>
					))}
				{editions && (
					<Button className="w-full" variant="outline" onClick={() => setIsOpen(false)}>
						collapse
					</Button>
				)}
			</CollapsibleContent>
		</Collapsible>
	) : (
		workLoading && <BookSearchCollapsibleSkeleton />
	)
}

export function BookSearchCollapsibleSkeleton() {
	return <Skeleton className="w-full h-20" />
}
