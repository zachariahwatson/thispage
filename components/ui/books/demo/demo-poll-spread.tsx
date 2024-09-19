"use client"

import { DemoPollPageLeft, DemoPollPageRight } from "@/components/ui/books/demo"
import { Spread } from "@/components/ui/books"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function DemoPollSpread({ isVisible, userSpreadIndex }: Props) {
	return (
		<Spread id={`demo-poll-spread`} isVisible={isVisible}>
			<DemoPollPageLeft userSpreadIndex={userSpreadIndex} />
			<DemoPollPageRight userSpreadIndex={userSpreadIndex} />
		</Spread>
	)
}
