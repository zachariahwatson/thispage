"use client"

import { ClubType, ReadingType } from "@/utils/types"
import { ReadingSpread } from "@/components/ui/book/"
import { Skeleton } from "@/components/ui/"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/buttons"
import { useQuery } from "react-query"

interface Props {
	clubData: ClubType
	clubIndex: number
}

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function Spreads({ clubData, clubIndex }: Props) {
	const [readingIndex, setReadingIndex] = useState<number>(clubData.readingTabIndex)

	const fetchReadings = async () => {
		const url = new URL(`http://127.0.0.1:3000/api/clubs/${clubData.id}/readings`)
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

	const { data: readings, isLoading: loading } = useQuery<ReadingType[]>(["readings", clubData.id], () =>
		fetchReadings()
	)

	const handleNextPage = () => {
		readings && setReadingIndex((readingIndex + 1) % readings.length)
	}

	return !loading && readings ? (
		<>
			{readings.map((reading: ReadingType, index) => (
				<ReadingSpread
					key={reading.id}
					readingData={reading}
					clubIndex={clubIndex}
					isVisible={readingIndex === index}
					readingIndex={index}
				/>
			))}
			<Button id={`club-${clubData.id}-next-button`} onClick={handleNextPage} className="absolute right-8 bottom-8">
				next
			</Button>
		</>
	) : (
		<SpreadSkeleton />
	)
}

export function SpreadSkeleton() {
	return <Skeleton className="h-full" />
}
