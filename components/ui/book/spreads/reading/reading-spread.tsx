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
	isVisible: boolean
	readingIndex: number
}
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"
import { useClubMembership, useReading } from "@/contexts"
import { useUserProgress } from "@/hooks/state"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function ReadingSpread({ isVisible, readingIndex }: Props) {
	const readingData = useReading()

	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div
					id={`club-${readingData?.club_id}-spread`}
					className="h-full flex flex-col md:flex-row rounded-lg bg-background"
				>
					<ReadingPageLeft readingIndex={readingIndex} />
					<ReadingPageRight />
				</div>
			)}
		</AnimatePresence>
	)
}
