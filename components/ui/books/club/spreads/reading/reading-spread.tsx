"use client"

import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/books/club/spreads/reading"
import { useClubMembership, useReading } from "@/contexts"
import { useSpreadsCount } from "@/hooks/state"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function ReadingSpread({ isVisible, userSpreadIndex }: Props) {
	const readingData = useReading()
	const clubMembership = useClubMembership()
	const { data: spreadsCount } = useSpreadsCount(clubMembership?.club.id || -1, clubMembership?.role || "member")

	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div
					id={`club-${readingData?.club_id}-reading-${readingData?.id}-spread`}
					className="h-full flex flex-col md:flex-row rounded-lg"
				>
					<ReadingPageLeft userSpreadIndex={userSpreadIndex} />
					<ReadingPageRight userSpreadIndex={userSpreadIndex} />
				</div>
			)}
		</AnimatePresence>
	)
}
