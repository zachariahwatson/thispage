"use client"

import { DemoReadingPageLeft, DemoReadingPageRight } from "@/components/ui/books/demo"
import { useState } from "react"
import { Spread } from "@/components/ui/books"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function DemoReadingSpread({ isVisible, userSpreadIndex }: Props) {
	const [isComplete, setIsComplete] = useState<boolean>(false)
	return (
		<Spread id={`demo-reading-spread`} isVisible={isVisible}>
			<DemoReadingPageLeft userSpreadIndex={userSpreadIndex} isComplete={isComplete} setIsComplete={setIsComplete} />
			<DemoReadingPageRight userSpreadIndex={userSpreadIndex} isComplete={isComplete} />
		</Spread>
	)
}
