"use client"

import { ThemeReadingPageLeft, ThemeReadingPageRight } from "@/components/ui/themes"
import { useState } from "react"
import { Spread } from "@/components/ui/books"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function ThemeReadingSpread({ isVisible, userSpreadIndex }: Props) {
	const [isComplete, setIsComplete] = useState<boolean>(false)
	return (
		<Spread isVisible={isVisible}>
			<ThemeReadingPageLeft userSpreadIndex={userSpreadIndex} isComplete={isComplete} setIsComplete={setIsComplete} />
			<ThemeReadingPageRight userSpreadIndex={userSpreadIndex} isComplete={isComplete} />
		</Spread>
	)
}
