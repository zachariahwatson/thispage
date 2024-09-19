"use client"

import { ThemePollPageLeft, ThemePollPageRight } from "@/components/ui/themes"
import { Spread } from "@/components/ui/books"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function ThemePollSpread({ isVisible, userSpreadIndex }: Props) {
	return (
		<Spread id={`demo-poll-spread`} isVisible={isVisible}>
			<ThemePollPageLeft userSpreadIndex={userSpreadIndex} />
			<ThemePollPageRight userSpreadIndex={userSpreadIndex} />
		</Spread>
	)
}
