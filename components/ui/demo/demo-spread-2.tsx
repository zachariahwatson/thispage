"use client"

import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/book"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	readingIndex: number
}
import { useReading } from "@/contexts"
import { DemoPageLeft2 } from "./demo-page-left-2"
import { DemoPageRight2 } from "./demo-page-right-2"
import { useState } from "react"

export function DemoSpread2({ isVisible, readingIndex }: Props) {
	const [demoIsComplete, setDemoIsComplete] = useState<boolean>(false)
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div id={`demo-spread`} className="h-full w-full flex flex-col md:flex-row rounded-lg bg-background">
					<DemoPageLeft2
						readingIndex={readingIndex}
						demoIsComplete={demoIsComplete}
						setDemoIsComplete={setDemoIsComplete}
					/>
					<DemoPageRight2 demoIsComplete={demoIsComplete} />
				</div>
			)}
		</AnimatePresence>
	)
}
