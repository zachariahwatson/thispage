"use client"

import { Card } from "@/components/ui"
import { useClubMembership } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	dir: "left" | "right"
	stitching?: boolean | undefined
}

export function Spine({ dir, stitching = false }: Props) {
	return (
		<>
			<div
				className={`${
					dir === "left" ? "bg-gradient-to-l right-0" : "bg-gradient-to-r left-0"
				} from-shadow to-page py-2 hidden md:block absolute h-full top-0  w-4`}
			>
				{stitching && (
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 4 100" className="h-full text-secondary">
						<line
							x1={dir === "left" ? "4" : "0"}
							y1="0"
							x2={dir === "left" ? "4" : "0"}
							y2="100"
							stroke="currentColor"
							strokeWidth=".5"
							strokeDasharray="2 2"
						/>
					</svg>
				)}
			</div>
			<div
				className={`${
					dir === "left" ? "bg-gradient-to-t bottom-0" : "bg-gradient-to-b top-0"
				} from-shadow to-page px-2 block md:hidden absolute w-full  right-0 h-4`}
			>
				{stitching && (
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 4" className="w-full text-secondary">
						<line
							x1="0"
							y1={dir === "left" ? "4" : "0"}
							x2="100"
							y2={dir === "left" ? "4" : "0"}
							stroke="currentColor"
							strokeWidth=".5"
							strokeDasharray="3 3"
						/>
					</svg>
				)}
			</div>
		</>
	)
}
