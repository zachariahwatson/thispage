"use client"

import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/books/club/spreads/reading"
import { useReading } from "@/contexts"
import { Spread } from "@/components/ui/books/"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function ReadingSpread({ isVisible, userSpreadIndex }: Props) {
	const readingData = useReading()

	return (
		<Spread id={`club-${readingData?.club_id}-reading-${readingData?.id}-spread`} isVisible={isVisible}>
			<ReadingPageLeft userSpreadIndex={userSpreadIndex} />
			<ReadingPageRight userSpreadIndex={userSpreadIndex} />
		</Spread>
	)
}
