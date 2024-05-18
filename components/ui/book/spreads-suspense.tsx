"use client"

import { ClubType, ReadingType } from "@/utils/types"
import { ReadingSpread } from "@/components/ui/book/reading-spread"
import { useEffect, useState } from "react"

interface Props {
	clubData: ClubType
	clubIndex: number
}

export async function SpreadsSuspense({ clubData, clubIndex }: Props) {
	const [readings, setReadings] = useState<ReadingType[]>()

	useEffect(() => {
		const fetchReadings = async () => {
			const url = new URL(`http://127.0.0.1:3000/api/clubs/${clubData.id}/readings`)
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
		fetchReadings()
	}, [])

	return (
		readings &&
		readings.map(
			(reading: ReadingType, index) =>
				clubData.readingTabIndex === index &&
				reading.isCurrent &&
				!reading.isFinished && <ReadingSpread readingData={reading} clubIndex={clubIndex} />
		)
	)
}
