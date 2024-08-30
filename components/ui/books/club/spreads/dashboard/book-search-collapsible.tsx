"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger, Skeleton } from "@/components/ui"
import { BookSearchItem } from "@/components/ui/books/club/spreads/dashboard"
import { FormDescription, FormItem, FormLabel } from "@/components/ui/forms"
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
								{loading ? (
									<Skeleton className="w-28 h-4 rounded-[3px] mt-2" />
								) : (
									<>
										view {editions && editions.entries && editions.entries.length} editions{" "}
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
									</>
								)}
							</FormDescription>
						</FormLabel>
					</FormItem>
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="space-y-2 px-4">
				{loading ? (
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
					editions &&
					editions.entries &&
					editions.entries.map(
						(entry: any, i: number) =>
							(entry.number_of_pages || entry.pagination) && (
								<BookSearchItem item={entry} authors={item.author_name} key={i} radioRef={radioRef} />
							)
					)
				)}
			</CollapsibleContent>
		</Collapsible>
	)
}

export function BookSearchCollapsibleSkeleton() {
	return <Skeleton className="w-full h-20" />
}
