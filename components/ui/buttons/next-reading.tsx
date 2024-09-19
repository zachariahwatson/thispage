"use client"

import { useClubMembership } from "@/contexts"
import { motion } from "framer-motion"
import { useState } from "react"

interface Props {
	userSpreadIndex: number
	setUserSpreadIndex: React.Dispatch<React.SetStateAction<number>>
	len: number
}

export function NextReading({ userSpreadIndex, setUserSpreadIndex, len }: Props) {
	const clubMembership = useClubMembership()

	const nextReading = () => {
		localStorage.setItem(
			`club-${clubMembership?.club.id}-member-${clubMembership?.id}-tab-index`,
			((userSpreadIndex + 1) % len).toString()
		)
		setUserSpreadIndex((userSpreadIndex + 1) % len)
	}

	const [isHovered, setIsHovered] = useState(false)

	return (
		len > 1 && (
			<>
				<motion.div
					className="absolute bottom-0 right-0 border-b-transparent border-l-page-fold shadow-[-4px_-4px_5px_0_hsl(var(--shadow)/0.66)] rounded-tl-lg rounded-br-lg flex justify-center items-center"
					initial={{ borderBottomWidth: 52, borderLeftWidth: 52 }}
					animate={{ borderBottomWidth: isHovered ? 60 : 52, borderLeftWidth: isHovered ? 60 : 52 }}
				/>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="absolute bottom-2 right-2 size-5 text-muted-foreground"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
				</svg>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={0.61}
					stroke="currentColor"
					className="absolute bottom-0 right-0 text-border/50"
					initial={{ width: 52, height: 52 }}
					animate={{ width: isHovered ? 60 : 52, height: isHovered ? 60 : 52 }}
				>
					<line x1=".5" y1="24" x2="24" y2=".5" />
				</motion.svg>
				<motion.button
					className="absolute bottom-0 right-0 flex justify-center items-center p-0 rounded-br-lg rounded-tl-lg border-t border-l border-border"
					initial={{ width: 52, height: 52 }}
					animate={{ width: isHovered ? 60 : 52, height: isHovered ? 60 : 52 }}
					onClick={nextReading}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				/>
			</>
		)
	)
}
