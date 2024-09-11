"use client"

import { ThemePollPageLeft, ThemePollPageRight } from "@/components/ui/themes"
import { useClubMembership, usePoll } from "@/contexts"
import { useSpreadsCount } from "@/hooks/state"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function ThemePollSpread({ isVisible, userSpreadIndex }: Props) {
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div id={`demo-poll-spread`} className="h-full flex flex-col md:flex-row rounded-lg">
					<ThemePollPageLeft userSpreadIndex={userSpreadIndex} />
					<ThemePollPageRight userSpreadIndex={userSpreadIndex} />
				</div>
			)}
		</AnimatePresence>
	)
}
