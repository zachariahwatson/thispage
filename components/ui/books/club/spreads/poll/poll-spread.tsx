"use client"

import { PollPageLeft, PollPageRight } from "@/components/ui/books/club/spreads/poll"
import { useClubMembership, usePoll } from "@/contexts"
import { useSpreadsCount } from "@/hooks/state"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function PollSpread({ isVisible, userSpreadIndex }: Props) {
	const pollData = usePoll()
	const clubMembership = useClubMembership()
	const { data: spreadsCount } = useSpreadsCount(clubMembership?.club.id || -1, clubMembership?.role || "member")

	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div id={`club-${pollData?.club_id}-spread`} className="h-full flex flex-col md:flex-row rounded-lg">
					<PollPageLeft userSpreadIndex={userSpreadIndex} />
					<PollPageRight userSpreadIndex={userSpreadIndex} />
				</div>
			)}
		</AnimatePresence>
	)
}
