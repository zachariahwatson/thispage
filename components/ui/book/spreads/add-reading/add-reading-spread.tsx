"use client"

import { AddReadingPageLeft, AddReadingPageRight, ReadingPageLeft, ReadingPageRight } from "@/components/ui/book"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	readingIndex: number
}
import { useClubMembership, useReading } from "@/contexts"
import { useReadings } from "@/hooks/state"

export function AddReadingSpread({ isVisible, readingIndex }: Props) {
	return (
		/**
		 * @todo figure out why the spread gets stuck while exiting when adding a new reading
		 */
		//<AnimatePresence mode="popLayout">
		isVisible && (
			<div className="h-full flex flex-col md:flex-row rounded-lg bg-background">
				<AddReadingPageLeft readingIndex={readingIndex} />
				<AddReadingPageRight readingIndex={readingIndex} />
			</div>
		)
		//</AnimatePresence>
	)
}
