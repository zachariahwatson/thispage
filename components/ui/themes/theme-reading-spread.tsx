"use client"

import { ThemeReadingPageLeft, ThemeReadingPageRight } from "@/components/ui/themes"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function ThemeReadingSpread({ isVisible, userSpreadIndex }: Props) {
	const [isComplete, setIsComplete] = useState<boolean>(false)
	const [clicked, setClicked] = useState<boolean>(false)
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
					<ThemeReadingPageLeft
						userSpreadIndex={userSpreadIndex}
						isComplete={isComplete}
						setIsComplete={setIsComplete}
					/>
					<ThemeReadingPageRight userSpreadIndex={userSpreadIndex} isComplete={isComplete} />
				</div>
			)}
		</AnimatePresence>
	)
}
