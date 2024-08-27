"use client"

import { DemoReadingPageLeft, DemoReadingPageRight } from "@/components/ui/demo"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function DemoReadingSpread({ isVisible, userSpreadIndex }: Props) {
	const [isComplete, setIsComplete] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
					<DemoReadingPageLeft
						userSpreadIndex={userSpreadIndex}
						isComplete={isComplete}
						setIsComplete={setIsComplete}
					/>
					<DemoReadingPageRight userSpreadIndex={userSpreadIndex} isComplete={isComplete} />
				</div>
			)}
		</AnimatePresence>
	)
}
