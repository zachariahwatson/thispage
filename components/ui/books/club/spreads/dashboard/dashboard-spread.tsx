"use client"

import { DashboardPageLeft, DashboardPageRight } from "@/components/ui/books/club/spreads/dashboard"
import { useClubMembership } from "@/contexts"
import { useSpreadsCount } from "@/hooks/state"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
	setUserSpreadIndex: React.Dispatch<React.SetStateAction<number>>
}
import { AnimatePresence } from "framer-motion"

export function DashboardSpread({ isVisible, userSpreadIndex, setUserSpreadIndex }: Props) {
	const clubMembership = useClubMembership()
	const { data: spreadsCount } = useSpreadsCount(clubMembership?.club.id || -1, clubMembership?.role || "member")
	return (
		/**
		 * @todo figure out why the spread gets stuck while exiting when adding a new reading
		 * for some reason adding a key fixes it?
		 */
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div
					id={`club-${clubMembership?.club.id}-dashboard-spread`}
					className="h-full flex flex-col md:flex-row rounded-lg"
				>
					<DashboardPageLeft userSpreadIndex={userSpreadIndex} />
					<DashboardPageRight userSpreadIndex={userSpreadIndex} setUserSpreadIndex={setUserSpreadIndex} />
				</div>
			)}
		</AnimatePresence>
	)
}
