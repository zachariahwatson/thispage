"use client"

import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/book"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	readingIndex: number
}
import { useReading } from "@/contexts"
import { DemoReadingPageLeft } from "./demo-reading-page-left"
import { DemoReadingPageRight } from "./demo-reading-page-right"
import { useState } from "react"

export function DemoReadingSpread({ isVisible, readingIndex }: Props) {
	const [isComplete, setIsComplete] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
					<DemoReadingPageLeft readingIndex={readingIndex} isComplete={isComplete} setIsComplete={setIsComplete} />
					<DemoReadingPageRight isComplete={isComplete} />
				</div>
			)}
		</AnimatePresence>
	)
}
