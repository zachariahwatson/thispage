"use client"

import { DemoReadingPageLeft, DemoReadingPageRight } from "@/components/ui/demo"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"

interface Props {
	isVisible: boolean
	readingIndex: number
}

export function DemoReadingSpread({ isVisible, readingIndex }: Props) {
	const [isComplete, setIsComplete] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
					<DemoReadingPageLeft readingIndex={readingIndex} isComplete={isComplete} setIsComplete={setIsComplete} />
					<DemoReadingPageRight readingIndex={readingIndex} isComplete={isComplete} />
				</div>
			)}
		</AnimatePresence>
	)
}
