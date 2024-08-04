"use client"

import { ReadingPageLeft, ReadingPageRight } from "@/components/ui/book"
import { AnimatePresence } from "framer-motion"

interface Props {
	isVisible: boolean
	readingIndex: number
}
import { useReading } from "@/contexts"
import { DemoPageLeft1 } from "./demo-page-left-1"
import { DemoPageRight1 } from "./demo-page-right-1"
import { useState } from "react"

export function DemoSpread1({ isVisible, readingIndex }: Props) {
	const [demoIsComplete, setDemoIsComplete] = useState<boolean>(false)
	const [demoClicked, setDemoClicked] = useState<boolean>(false)
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div id={`demo-spread`} className="h-full w-full flex flex-col md:flex-row rounded-lg bg-background">
					<DemoPageLeft1
						readingIndex={readingIndex}
						demoIsComplete={demoIsComplete}
						setDemoIsComplete={setDemoIsComplete}
						demoClicked={demoClicked}
						setDemoClicked={setDemoClicked}
					/>
					<DemoPageRight1 readingIndex={readingIndex} demoIsComplete={demoIsComplete} />
				</div>
			)}
		</AnimatePresence>
	)
}
