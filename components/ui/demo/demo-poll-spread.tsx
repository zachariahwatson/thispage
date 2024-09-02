"use client"

import { DemoPollPageLeft, DemoPollPageRight } from "@/components/ui/demo"
import { useClubMembership, usePoll } from "@/contexts"
import { useSpreadsCount } from "@/hooks/state"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function DemoPollSpread({ isVisible, userSpreadIndex }: Props) {
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div id={`demo-poll-spread`} className="h-full flex flex-col md:flex-row rounded-lg">
					<DemoPollPageLeft userSpreadIndex={userSpreadIndex} />
					<DemoPollPageRight userSpreadIndex={userSpreadIndex} />
				</div>
			)}
		</AnimatePresence>
	)
}
