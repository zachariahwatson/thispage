"use client"

import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/books/club/spreads/reading"
import { usePoll } from "@/contexts"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	readingIndex: number
}

export function PollSpread({ isVisible, readingIndex }: Props) {
	const pollData = usePoll()

	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div
					id={`club-${pollData?.club_id}-spread`}
					className="h-full flex flex-col md:flex-row rounded-lg bg-background"
				>
					<PollPageLeft readingIndex={readingIndex} />
					<PollPageRight readingIndex={readingIndex} />
				</div>
			)}
		</AnimatePresence>
	)
}
