"use client"
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
import { Interval, MemberProgress, Reading } from "@/lib/types"

interface Props {
	memberId: number
	readingData: Reading
	isVisible: boolean
	readingIndex: number
}
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

export function ReadingSpread({ memberId, readingData, isVisible, readingIndex }: Props) {
	const [userInterval, setUserInterval] = useState<User>()
	const isVertical = useMediaQuery("(max-width: 768px)")

	//fetch the reading's intervals
	const fetchIntervals = async () => {
		const url = new URL(`${defaultUrl}/api/clubs/${readingData?.club_id}/readings/${readingData?.id}/intervals`)
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

	const { data: intervals, isLoading: intervalsLoading } = useQuery<Interval[]>(
		["intervals", readingData?.club_id, readingData?.id],
		() => fetchIntervals()
	)

	//fetch the user's progress
	const fetchUserProgress = async () => {
		const url = new URL(
			`${defaultUrl}/api/users/progresses/${memberId}/intervals/${(intervals && intervals[0]?.id) || null}`
		)
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

	const { data: userProgress, isLoading: loading } = useQuery<MemberProgress>(
		["user progress", (intervals && intervals[0]?.id) || null],
		() => fetchUserProgress()
	)

	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div
					id={`club-${readingData?.club_id}-spread`}
					className="h-full flex flex-col md:flex-row rounded-lg bg-background"
				>
					<ReadingPageLeft
						memberId={memberId}
						userProgress={userProgress || null}
						interval={(intervals && intervals[0]) || null}
						readingData={readingData}
						isVertical={isVertical}
						readingIndex={readingIndex}
					/>
					<ReadingPageRight
						interval={(intervals && intervals[0]) || null}
						loading={intervalsLoading}
						userProgress={userProgress || null}
						clubId={readingData?.club_id || null}
						readingId={readingData?.id || null}
						isVertical={isVertical}
						readingIndex={readingIndex}
					/>
				</div>
			)}
		</AnimatePresence>
	)
}
