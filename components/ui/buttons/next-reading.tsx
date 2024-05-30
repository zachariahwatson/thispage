"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface Props {
	clubId: number
	readingIndex: number
	setReadingIndex: React.Dispatch<React.SetStateAction<number>>
	len: number
}

export function NextReading({ clubId, readingIndex, setReadingIndex, len }: Props) {
	const nextReading = () => {
		setReadingIndex((readingIndex + 1) % len)
		// localStorage.setItem(`club-${clubId}-tab-index`, readingIndex.toString())
	}

	const [isHovered, setIsHovered] = useState(false)

	return (
		<>
			<motion.div
				className="absolute bottom-4 right-4 border-b-[40px] border-l-[40px] border-b-secondary border-l-background shadow-[-4px_-4px_5px_0_rgba(0,0,0,0.1)] rounded-tl-lg rounded-br-lg flex justify-center items-center"
				initial={{ borderBottomWidth: 40, borderLeftWidth: 40 }}
				animate={{ borderBottomWidth: isHovered ? 47 : 40, borderLeftWidth: isHovered ? 47 : 40 }}
			/>
			<motion.div
				className="absolute bottom-4 right-4 border-b-[40px] border-l-[40px] border-b-transparent border-l-background opacity-5 rounded-tl-lg rounded-br-lg flex justify-center items-center"
				initial={{ borderBottomWidth: 40, borderLeftWidth: 40 }}
				animate={{ borderBottomWidth: isHovered ? 47 : 40, borderLeftWidth: isHovered ? 47 : 40 }}
			/>
			<button
				className="absolute bottom-4 right-4 w-[40px] h-[40px] flex justify-center items-center p-0"
				onClick={nextReading}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			/>
		</>
	)
}
