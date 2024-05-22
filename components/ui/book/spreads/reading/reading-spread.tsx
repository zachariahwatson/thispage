"use client"

import { ReadingType, IntervalType } from "@/utils/types"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui"
import {
	IntervalAvatarGroup,
	IntervalAvatarGroupSkeleton,
	ReadingPageLeft,
	ReadingPageRight,
	ReadingPosts,
} from "@/components/ui/book"
import { Separator } from "../../../separator"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/buttons"
import Image from "next/image"
import { useQuery } from "react-query"
import { useMediaQuery } from "@/hooks"
import { AnimatePresence } from "framer-motion"

interface Props {
	readingData: ReadingType
	clubIndex: number
	isVisible: boolean
}

export function ReadingSpread({ readingData, clubIndex, isVisible }: Props) {
	const [userInterval, setUserInterval] = useState<ReadingType["intervals"][0] | null>(null)
	const isVertical = useMediaQuery("(max-width: 768px)")

	useEffect(() => {
		const startDate = new Date(readingData.intervalStartDate)
		const endDate = new Date(startDate)
		endDate.setDate(startDate.getDate() + readingData.intervalDays)

		const filteredIntervals = readingData.intervals.filter((interval) => {
			const createdAt = new Date(interval.createdAt)
			return (
				interval.isCurrent &&
				createdAt >= startDate &&
				(readingData.intervalType !== "SCHEDULED" || createdAt <= endDate)
			)
		})

		const mostRecentInterval =
			filteredIntervals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null

		setUserInterval(mostRecentInterval)
	}, [])

	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div id={`club-${clubIndex}-spread`} className="h-full flex flex-col md:flex-row rounded-lg">
					<ReadingPageLeft readingData={readingData} isVertical={isVertical} userInterval={userInterval} />
					<ReadingPageRight
						clubId={readingData.clubId}
						readingId={readingData.id}
						isVertical={isVertical}
						clubIndex={clubIndex}
						userInterval={userInterval}
					/>
				</div>
			)}
		</AnimatePresence>
	)
}
