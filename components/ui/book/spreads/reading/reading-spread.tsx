"use client"

import { ReadingType, IntervalType } from "@/utils/types"
import { Card } from "@/components/ui"
import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/book"
import { Separator } from "../../../separator"
import { useEffect, useState } from "react"

interface Props {
	readingData: ReadingType
	clubIndex: number
}

export function ReadingSpread({ readingData, clubIndex }: Props) {
	const [userInterval, setUserInterval] = useState<IntervalType[]>()
	const [loading, setLoading] = useState<boolean>(true)

	// useEffect(() => {
	// 	const fetchClubs = async () => {
	// 		const url = new URL(`http://127.0.0.1:3000/api/clubs/${readingData.clubId}/readings/${readingData.id}/intervals`)
	// 		const response = await fetch(url, {
	// 			method: "GET",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		})

	// 		if (!response.ok) {
	// 			const body = await response.json()
	// 			throw new Error(body.error)
	// 		}

	// 		setClubs(await response.json())
	// 	}
	// 	fetchClubs().then(() => setLoading(false))
	// }, [])
	return (
		<div id={`club-${clubIndex}-spread`} className="h-full flex flex-col md:flex-row">
			{/* {JSON.stringify(readingData, null, 2)} */}
			<ReadingPageLeft readingData={readingData} />
			<Separator orientation="vertical" className="mx-4 hidden md:block" />
			<Separator orientation="horizontal" className="my-4 block md:hidden" />
			<ReadingPageRight readingData={readingData} />
		</div>
	)
}
