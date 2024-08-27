"use client"

import { DemoPageLeft1, DemoPageRight1 } from "@/components/ui/demo"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"

interface Props {
	isVisible: boolean
	readingIndex: number
}

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
