"use client"
import { BookSearchCollapsible, BookSearchCollapsibleSkeleton } from "@/components/ui/books/club/spreads/dashboard"
import { BookSearch } from "@/lib/types"
import React, { useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "react-query"

interface Props {
	search: string
	groupValue: string | undefined
	language:
		| {
				name: string
				key: string
				count: number
		  }
		| undefined
}

export function BookSearchList({ search, groupValue, language }: Props) {
	const { ref, inView, entry } = useInView()
	const scrollRef = useRef<HTMLDivElement>(null)

	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	const {
		data: books,
		isFetching: loading,
		isFetchingNextPage: loadingNext,
		refetch,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery<BookSearch>({
		queryKey: ["books", search],
		queryFn: async ({ pageParam }) => {
			if (search !== "") {
				const url = new URL(`${defaultUrl}/api/books/${search.replaceAll(" ", "+")}`)
				url.searchParams.append("page", pageParam)
				url.searchParams.append("language", language?.key.split("/")[2] ?? "eng")
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
			return null
		},
		getNextPageParam: (lastPage, pages) => pages.length + 1,
	})

	useEffect(() => {
		if (search !== "") {
			refetch()
		}
	}, [search])

	useEffect(() => {
		refetch()
		if (scrollRef.current) {
			scrollRef.current.scrollTo({ top: 0, behavior: "smooth" })
		}
	}, [language])

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage()
		}
	}, [inView])

	return (
		// <ScrollArea className="h-96 shadow-inner rounded-md shadow-shadow pt-3">
		<div
			ref={scrollRef}
			className="p-4 pt-3 space-y-3 h-96 shadow-inner rounded-md shadow-shadow w-full overflow-y-scroll"
		>
			{books &&
				books.pages.map((group: BookSearch, i: number) => (
					<React.Fragment key={i}>
						{group &&
							group.docs?.map((book: BookSearch["docs"][number]) => (
								<BookSearchCollapsible item={book} key={book.key} groupValue={groupValue} language={language} />
							))}
					</React.Fragment>
				))}
			{loading && !loadingNext ? (
				<>
					<BookSearchCollapsibleSkeleton />
					<BookSearchCollapsibleSkeleton />
					<BookSearchCollapsibleSkeleton />
					<BookSearchCollapsibleSkeleton />
					<BookSearchCollapsibleSkeleton />
				</>
			) : loadingNext ? (
				<div className="flex justify-center">
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
			) : null}
			<div ref={ref} />
		</div>
		// </ScrollArea>
	)
}
