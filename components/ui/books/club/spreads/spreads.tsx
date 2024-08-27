"use client"

import { Skeleton } from "@/components/ui/"
import { EmptyPageLeft, EmptyPageRight } from "@/components/ui/books/club/spreads"
import { DashboardSpread } from "@/components/ui/books/club/spreads/dashboard"
import { ReadingSpread } from "@/components/ui/books/club/spreads/reading"
import { NextReading } from "@/components/ui/buttons"
import { PollProvider, ReadingProvider, useClubMembership } from "@/contexts"
import { usePolls, useReadings } from "@/hooks/state"
import { useState } from "react"
import { PollSpread } from "@/components/ui/books/club/spreads/poll"

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 * @todo add a "bookmark" at the start of each spread map
 */
export function Spreads() {
	const clubMembership = useClubMembership()

	const [readingIndex, setReadingIndex] = useState<number>(
		//Number(localStorage.getItem(`club-${clubMembership?.club.id}-tab-index`))
		0
	)

	let spreadIndex = 0

	const { data: readings, isLoading: readingsLoading } = useReadings(clubMembership?.club.id || -1)
	const { data: polls, isLoading: pollsLoading } = usePolls(clubMembership?.club.id || -1)

	return !readingsLoading && readings && !pollsLoading && polls ? (
		<>
			{readings.map(
				(reading) =>
					reading && (
						<ReadingProvider key={spreadIndex} readingData={reading}>
							<ReadingSpread isVisible={readingIndex === spreadIndex} readingIndex={spreadIndex++} />
						</ReadingProvider>
					)
			)}

			{polls.map(
				(poll) =>
					poll && (
						<PollProvider key={spreadIndex} pollData={poll}>
							<PollSpread isVisible={readingIndex === spreadIndex} readingIndex={spreadIndex++} />
						</PollProvider>
					)
			)}

			{clubMembership?.role !== "member" ? (
				<DashboardSpread isVisible={readingIndex === spreadIndex} readingIndex={spreadIndex++} />
			) : (
				readings.length === 0 && (
					<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
						<EmptyPageLeft readingIndex={0} />
						<EmptyPageRight readingIndex={0} />
					</div>
				)
			)}

			<NextReading readingIndex={readingIndex} setReadingIndex={setReadingIndex} len={spreadIndex} />
		</>
	) : (
		<SpreadSkeleton />
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
