"use client"

import { IntervalType, ReadingType } from "@/utils/types"
import { useEffect, useState } from "react"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui"
import { IntervalAvatarGroup } from "./interval-avatar-group"
import { IntervalAvatarGroupSkeleton } from "./interval-avatar-group-skeleton"

interface Props {
	readingData: ReadingType
}

export function ReadingPageRight({ readingData }: Props) {
	const [intervals, setIntervals] = useState<IntervalType[]>()
	const [intervalLoading, setIntervalLoading] = useState<boolean>(true)

	useEffect(() => {
		const fetchIntervals = async () => {
			const url = new URL(`http://127.0.0.1:3000/api/clubs/${readingData.clubId}/readings/${readingData.id}/intervals`)
			url.searchParams.append("current", "true")
			url.searchParams.append("completed", "false")
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

			setIntervals(await response.json())
		}
		fetchIntervals().then(() => setIntervalLoading(false))
	}, [])

	return (
		<Card className="flex-1 relative">
			<CardHeader>
				<CardTitle className="text-xl">discussion</CardTitle>
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex-col w-full items-start space-y-2">
				<CardTitle className="text-xl">members</CardTitle>
				{!intervalLoading && intervals ? (
					<IntervalAvatarGroup intervals={intervals} />
				) : (
					<IntervalAvatarGroupSkeleton />
				)}
			</CardFooter>
		</Card>
	)
}
