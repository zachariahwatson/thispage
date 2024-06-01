"use client"

import { ReadingSpread } from "@/components/ui/book/"
import { Skeleton } from "@/components/ui/"
import { useEffect, useState } from "react"
import { Button, NextReading } from "@/components/ui/buttons"
import { useQuery } from "react-query"
import { ClubMembership, Reading } from "@/lib/types"

interface Props {
	clubMembershipData: ClubMembership
}

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function Spreads({ clubMembershipData }: Props) {
	const [readingIndex, setReadingIndex] = useState<number>(
		Number(localStorage.getItem(`club-${clubMembershipData.club?.id}-tab-index`))
	)

	const fetchReadings = async () => {
		const url = new URL(`http://localhost:3000/api/clubs/${clubMembershipData.club?.id}/readings`)
		url.searchParams.append("current", "true")
		url.searchParams.append("finished", "false")
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

	const { data: readings, isLoading: loading } = useQuery<Reading[]>(["readings", clubMembershipData.club.id], () =>
		fetchReadings()
	)

	return !loading && readings ? (
		<>
			{readings.map(
				(reading, index) =>
					reading && (
						<ReadingSpread
							key={index}
							memberId={clubMembershipData.id}
							readingData={reading}
							isVisible={readingIndex === index}
							readingIndex={index}
						/>
					)
			)}
			<NextReading
				clubId={clubMembershipData.club.id}
				readingIndex={readingIndex}
				setReadingIndex={setReadingIndex}
				len={readings.length}
			/>
		</>
	) : (
		<SpreadSkeleton />
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
