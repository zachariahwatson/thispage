"use client"

import { ReadingSpread } from "@/components/ui/book/"
import { Skeleton } from "@/components/ui/"
import { useContext, useState } from "react"
import { NextReading } from "@/components/ui/buttons"
import { useReadings } from "@/hooks/state"
import { ReadingProvider, useClubMembership } from "@/contexts"

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function Spreads() {
	const clubMembership = useClubMembership()

	const [readingIndex, setReadingIndex] = useState<number>(
		Number(localStorage.getItem(`club-${clubMembership?.club.id}-tab-index`))
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
			<NextReading readingIndex={readingIndex} setReadingIndex={setReadingIndex} len={readings.length} />
		</>
	) : (
		<SpreadSkeleton />
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
