"use client"

import { ClubType, ReadingType } from "@/utils/types"
import { ReadingSpread, SpreadSkeleton } from "@/components/ui/book/"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/buttons"

interface Props {
	clubData: ClubType
	clubIndex: number
}

/**
 * returns a list of book club reading "spreads". we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function Spreads({ clubData, clubIndex }: Props) {
	const [readings, setReadings] = useState<ReadingType[]>()
	const [readingIndex, setReadingIndex] = useState<number>(clubData.readingTabIndex)
	const [loading, setLoading] = useState<boolean>(true)

	const handleNextPage = () => {
		readings && setReadingIndex((readingIndex + 1) % readings.length)
	}

	useEffect(() => {
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

			setReadings(await response.json())
		}
		fetchReadings().then(() => setLoading(false))
	}, [])

	return !loading && readings ? (
		<>
			{readings.map(
				(reading: ReadingType, index) =>
					readingIndex === index && <ReadingSpread key={reading.id} readingData={reading} clubIndex={clubIndex} />
			)}
			<Button id={`club-${clubIndex}-next-button`} onClick={handleNextPage} className="absolute right-8 bottom-8">
				next
			</Button>
		</>
	) : (
		<SpreadSkeleton />
	)
}
