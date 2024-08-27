"use client"

import { Skeleton } from "@/components/ui/"
import { EmptyPageLeft, EmptyPageRight } from "@/components/ui/books/club/spreads"
import { DashboardSpread } from "@/components/ui/books/club/spreads/dashboard"
import { ReadingSpread } from "@/components/ui/books/club/spreads/reading"
import { NextReading } from "@/components/ui/buttons"
import { ReadingProvider, useClubMembership } from "@/contexts"
import { useReadings } from "@/hooks/state"
import { useState } from "react"

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function Spreads() {
	const clubMembership = useClubMembership()

	const [readingIndex, setReadingIndex] = useState<number>(
		//Number(localStorage.getItem(`club-${clubMembership?.club.id}-tab-index`))
		0
	)

	const { data: readings, isLoading: loading } = useReadings(clubMembership?.club.id || -1)

	return !loading && readings ? (
		<>
			{readings.map(
				(reading, index) =>
					reading && (
						<ReadingProvider key={index} readingData={reading}>
							<ReadingSpread isVisible={readingIndex === index} readingIndex={index} />
						</ReadingProvider>
					)
			)}

			{clubMembership?.role !== "member" ? (
				<DashboardSpread isVisible={readingIndex === readings.length} readingIndex={readings.length} />
			) : (
				readings.length === 0 && (
					<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
						<EmptyPageLeft readingIndex={0} />
						<EmptyPageRight readingIndex={0} />
					</div>
				)
			)}

			<NextReading
				readingIndex={readingIndex}
				setReadingIndex={setReadingIndex}
				len={clubMembership?.role !== "member" ? readings.length + 1 : readings.length}
			/>
		</>
	) : (
		<SpreadSkeleton />
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
