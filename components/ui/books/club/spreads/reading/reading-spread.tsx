"use client"

import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/books/club/spreads/reading"
import { useReading } from "@/contexts"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function ReadingSpread({ isVisible, userSpreadIndex }: Props) {
	const readingData = useReading()

	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div
					id={`club-${readingData?.club_id}-spread`}
					className="h-full flex flex-col md:flex-row rounded-lg bg-background"
				>
					<ReadingPageLeft userSpreadIndex={userSpreadIndex} />
					<ReadingPageRight userSpreadIndex={userSpreadIndex} />
				</div>
			)}
		</AnimatePresence>
	)
}
