"use client"

import { PollPageLeft, PollPageRight } from "@/components/ui/books/club/spreads/poll"
import { usePoll } from "@/contexts"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function PollSpread({ isVisible, userSpreadIndex }: Props) {
	const pollData = usePoll()

	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div
					id={`club-${pollData?.club_id}-spread`}
					className="h-full flex flex-col md:flex-row rounded-lg bg-background"
				>
					<PollPageLeft userSpreadIndex={userSpreadIndex} />
					<PollPageRight userSpreadIndex={userSpreadIndex} />
				</div>
			)}
		</AnimatePresence>
	)
}
