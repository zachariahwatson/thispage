"use client"

import { PollPageLeft, PollPageRight } from "@/components/ui/books/club/spreads/poll"
import { usePoll } from "@/contexts"
import { Spread } from "@/components/ui/books/"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function PollSpread({ isVisible, userSpreadIndex }: Props) {
	const pollData = usePoll()

	return (
		<Spread id={`club-${pollData?.club_id}-poll-${pollData?.id}-spread`} isVisible={isVisible}>
			<PollPageLeft userSpreadIndex={userSpreadIndex} />
			<PollPageRight userSpreadIndex={userSpreadIndex} />
		</Spread>
	)
}
