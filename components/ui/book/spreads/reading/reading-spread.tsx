"use client"

import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/book"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	readingIndex: number
}
import { useReading } from "@/contexts"

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
