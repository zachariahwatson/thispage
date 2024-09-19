"use client"

import { EmptyPageLeft, EmptyPageRight } from "@/components/ui/books/club/spreads"
import { DashboardSpread } from "@/components/ui/books/club/spreads/dashboard"
import { ReadingSpread } from "@/components/ui/books/club/spreads/reading"
import { Button, NextReading, Tabs } from "@/components/ui/buttons"
import { PollProvider, ReadingProvider, useClubMembership } from "@/contexts"
import { usePolls, useReadings, useSpreadsCount } from "@/hooks/state"
import { useEffect, useState } from "react"
import { PollSpread } from "@/components/ui/books/club/spreads/poll"
import { QueryError } from "@/utils/errors"
import { PageLeft, PageRight, Spread } from "@/components/ui/books"
import { Card } from "@/components/ui"

/**
 * returns a list of book club reading "spreads".
 */
export function ClubSpreads() {
	const clubMembership = useClubMembership()
	const {
		data: spreadsCount,
		isLoading: spreadsCountLoading,
		error: spreadsCountError,
		refetch: spreadsCountRefetch,
	} = useSpreadsCount(clubMembership?.club.id || -1, clubMembership?.role || "member")

	const [userSpreadIndex, setUserSpreadIndex] = useState<number>(0)

	useEffect(() => {
		if (spreadsCount && spreadsCount.total_spreads) {
			setUserSpreadIndex(
				Number(localStorage.getItem(`club-${clubMembership?.club.id}-member-${clubMembership?.id}-tab-index`)) %
					spreadsCount.total_spreads
			)
		}
	}, [spreadsCount])

	let spreadIndex = 0

	const {
		data: readings,
		isLoading: readingsLoading,
		error: readingsError,
		refetch: readingsRefetch,
	} = useReadings(clubMembership?.club.id || -1, clubMembership?.id || -1)
	const {
		data: polls,
		isLoading: pollsLoading,
		error: pollsError,
		refetch: pollsRefetch,
	} = usePolls(clubMembership?.club.id || -1, clubMembership?.id || -1)

	return (
		<Card
			id={`club-${clubMembership?.club.id}-content`}
			className="h-[calc(100svh-56px)] min-h-[624px] md:h-[624px] p-3 md:p-4 rounded-3xl relative shadow-shadow shadow-md bg-book border-book-border"
		>
			<div className="absolute w-full h-full top-0 left-0 flex justify-center items-center font-epilogue pt-[calc(50svh-1.75rem)] md:pl-[calc(50%)] md:pt-0">
				<p className="text-2xl text-shadow-dark font-epilogue">
					this<span className="font-bold">page</span>
				</p>
			</div>
			{!spreadsCountError && !pollsError && !readingsError ? (
				<div className="relative w-full h-full border border-border shadow-md shadow-shadow-dark rounded-lg">
					<div className="absolute top-0 left-0 w-full h-full">
						<PageLeft disableAnimation />
					</div>

					{readings && polls && spreadsCount ? (
						<>
							{readings.map(
								(reading) =>
									reading && (
										<ReadingProvider key={spreadIndex} readingData={reading}>
											<ReadingSpread isVisible={userSpreadIndex === spreadIndex} userSpreadIndex={spreadIndex++} />
										</ReadingProvider>
									)
							)}

							{polls.map(
								(poll) =>
									poll && (
										<PollProvider key={spreadIndex} pollData={poll}>
											<PollSpread isVisible={userSpreadIndex === spreadIndex} userSpreadIndex={spreadIndex++} />
										</PollProvider>
									)
							)}

							{clubMembership?.role !== "member" ? (
								<DashboardSpread
									key={spreadIndex}
									isVisible={userSpreadIndex === spreadIndex}
									userSpreadIndex={spreadIndex++}
									setUserSpreadIndex={setUserSpreadIndex}
								/>
							) : (
								readings.length === 0 &&
								polls.length === 0 && (
									<Spread isVisible={true}>
										<EmptyPageLeft userSpreadIndex={0} />
										<EmptyPageRight userSpreadIndex={0} />
									</Spread>
								)
							)}

							<NextReading
								userSpreadIndex={userSpreadIndex}
								setUserSpreadIndex={setUserSpreadIndex}
								len={spreadsCount?.total_spreads || spreadIndex}
							/>

							<Tabs
								spreadsCount={spreadsCount}
								userSpreadIndex={userSpreadIndex}
								setUserSpreadIndex={setUserSpreadIndex}
							/>
						</>
					) : (
						(pollsLoading || readingsLoading || spreadsCountLoading) && <SpreadSkeleton />
					)}
				</div>
			) : (
				<div className="p-3 md:p-4 bg-destructive/15 flex flex-col justify-center items-center text-destructive space-y-2 rounded-md md:w-1/2 md:h-full mt-[calc(100%-2rem)] h-1/2 w-full md:ml-[50%] md:mt-0">
					<div className="flex flex-row justify-center items-center w-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-16 mr-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
							/>
						</svg>
						<div>
							{pollsError ? (
								<>
									<p>{(pollsError as QueryError).message}</p>
									<p className="text-muted-foreground">{(pollsError as QueryError).code}</p>
								</>
							) : readingsError ? (
								<>
									<p>{(readingsError as QueryError).message}</p>
									<p className="text-muted-foreground">{(readingsError as QueryError).code}</p>
								</>
							) : spreadsCountError ? (
								<>
									<p>{(spreadsCountError as QueryError).message}</p>
									<p className="text-muted-foreground">{(spreadsCountError as QueryError).code}</p>
								</>
							) : null}
						</div>
					</div>
					<Button
						variant="accent"
						onClick={(e) => {
							e.preventDefault()
							pollsRefetch()
							readingsRefetch()
							spreadsCountRefetch()
						}}
					>
						retry
					</Button>
				</div>
			)}
		</Card>
	)
}

export function SpreadSkeleton() {
	return (
		<div className="h-full flex flex-col md:flex-row">
			<div className="bg-transparent h-1/2 md:h-full md:w-1/2" />
			<PageRight className="animate-pulse" />
		</div>
	)
}
