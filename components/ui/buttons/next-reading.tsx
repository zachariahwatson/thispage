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
		localStorage.setItem(`club-${clubId}-tab-index`, ((readingIndex + 1) % len).toString())
		setReadingIndex((readingIndex + 1) % len)
	}

	const [isHovered, setIsHovered] = useState(false)

	return (
		<>
			<motion.div
				className="absolute bottom-4 right-4 border-b-[52px] border-l-[52px] border-b-secondary/50 border-l-background shadow-[-4px_-4px_5px_0_hsl(var(--shadow)/0.66)] rounded-tl-lg rounded-br-lg flex justify-center items-center"
				initial={{ borderBottomWidth: 52, borderLeftWidth: 52 }}
				animate={{ borderBottomWidth: isHovered ? 60 : 52, borderLeftWidth: isHovered ? 60 : 52 }}
			/>
			<button
				className="absolute bottom-4 right-4 w-[52px] h-[52px] flex justify-center items-center p-0 text-muted-foreground/50 border-border border-b-[.5px] border-r-[.5px] rounded-br-lg"
				onClick={nextReading}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-5 ml-3 mt-5"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
				</svg>
			</button>
		</>
	)
}
