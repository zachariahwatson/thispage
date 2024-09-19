"use client"

import { DashboardPageLeft, DashboardPageRight } from "@/components/ui/books/club/spreads/dashboard"
import { useClubMembership } from "@/contexts"
import { Spread } from "@/components/ui/books/"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
	setUserSpreadIndex: React.Dispatch<React.SetStateAction<number>>
}

export function DashboardSpread({ isVisible, userSpreadIndex, setUserSpreadIndex }: Props) {
	const clubMembership = useClubMembership()

	return (
		<Spread id={`club-${clubMembership?.club.id}-dashboard-spread`} isVisible={isVisible}>
			<DashboardPageLeft userSpreadIndex={userSpreadIndex} />
			<DashboardPageRight userSpreadIndex={userSpreadIndex} setUserSpreadIndex={setUserSpreadIndex} />
		</Spread>
	)
}
