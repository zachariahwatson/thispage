"use client"

import { Card, Separator, Skeleton } from "@/components/ui/"
import { EmptyPageLeft, EmptyPageRight } from "@/components/ui/books/club/spreads"
import { DashboardSpread } from "@/components/ui/books/club/spreads/dashboard"
import { ReadingSpread } from "@/components/ui/books/club/spreads/reading"
import { NextReading } from "@/components/ui/buttons"
import { PollProvider, ReadingProvider, useClubMembership } from "@/contexts"
import { usePolls, useReadings, useSpreadsCount, useUserProgress } from "@/hooks/state"
import { useEffect, useState } from "react"
import { PollSpread } from "@/components/ui/books/club/spreads/poll"

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 * @todo add a "bookmark" at the start of each spread map
 */
export function Spreads() {
	const clubMembership = useClubMembership()
	const { data: spreadsCount, isLoading: spreadsCountLoading } = useSpreadsCount(
		clubMembership?.club.id || -1,
		clubMembership?.role || "member"
	)

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

	const { data: readings, isLoading: readingsLoading } = useReadings(
		clubMembership?.club.id || -1,
		clubMembership?.id || -1
	)
	const { data: polls, isLoading: pollsLoading } = usePolls(clubMembership?.club.id || -1, clubMembership?.id || -1)

	return readings && polls && spreadsCount ? (
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
					<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
						<EmptyPageLeft userSpreadIndex={0} />
						<EmptyPageRight userSpreadIndex={0} />
					</div>
				)
			)}

			<NextReading
				userSpreadIndex={userSpreadIndex}
				setUserSpreadIndex={setUserSpreadIndex}
				len={spreadsCount?.total_spreads || spreadIndex}
			/>
		</>
	) : (
		(pollsLoading || readingsLoading || spreadsCountLoading) && <SpreadSkeleton />
	)
}

export function SpreadSkeleton() {
	return (
		<div className="h-full flex flex-col md:flex-row rounded-lg">
			<div className="h-1/2 md:h-full w-full md:w-1/2" />
			<Card className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-t-0 rounded-t-none md:border-t md:rounded-t-lg md:border-l-0 md:rounded-tl-none md:rounded-bl-none shadow-shadow shadow-md animate-pulse">
				<div className="bg-gradient-to-r from-shadow to-background py-2 hidden md:block absolute h-full top-0 left-0">
					<Separator orientation="vertical" className="mr-4 border-shadow-dark border-[.5px] border-dashed" />
				</div>
				<div className="bg-gradient-to-b from-shadow to-background px-2 block md:hidden absolute w-full top-0 right-0">
					<Separator orientation="horizontal" className="mb-4 border-shadow-dark border-[.5px] border-dashed" />
				</div>
			</Card>
		</div>
	)
}
