"use client"

import { DashboardPageLeft, DashboardPageRight } from "@/components/ui/books/club/spreads/dashboard"

interface Props {
	isVisible: boolean
	readingIndex: number
}
import { useClubMembership, useReading } from "@/contexts"
import { useReadings } from "@/hooks/state"

export function DashboardSpread({ isVisible, readingIndex }: Props) {
	return (
		/**
		 * @todo figure out why the spread gets stuck while exiting when adding a new reading
		 */
		//<AnimatePresence mode="popLayout">
		isVisible && (
			<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
				<DashboardPageLeft readingIndex={readingIndex} />
				<DashboardPageRight readingIndex={readingIndex} />
			</div>
		)
		//</AnimatePresence>
	)
}
