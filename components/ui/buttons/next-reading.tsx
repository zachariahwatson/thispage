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
		localStorage.setItem(`club-${clubMembership?.club.id}-tab-index`, ((userSpreadIndex + 1) % len).toString())
		setUserSpreadIndex((userSpreadIndex + 1) % len)
	}

	const [isHovered, setIsHovered] = useState(false)

	return (
		len > 1 && (
			<>
				<motion.div
					className="absolute bottom-4 right-4 border-b-[52px] border-l-[52px] border-b-transparent border-l-card shadow-[-4px_-4px_5px_0_hsl(var(--shadow)/0.66)] rounded-tl-lg rounded-br-lg flex justify-center items-center"
					initial={{ borderBottomWidth: 52, borderLeftWidth: 52 }}
					animate={{ borderBottomWidth: isHovered ? 60 : 52, borderLeftWidth: isHovered ? 60 : 52 }}
				/>
				<button
					className="absolute bottom-4 right-4 w-[52px] h-[52px] flex justify-center items-center p-0 text-muted-foreground/50 rounded-br-lg"
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
	)
}
