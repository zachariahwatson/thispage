"use client"

import { DemoPageLeft2, DemoPageRight2 } from "@/components/ui/demo"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function DemoSpread2({ isVisible, userSpreadIndex }: Props) {
	const [demoIsComplete, setDemoIsComplete] = useState<boolean>(false)
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div id={`demo-spread`} className="h-full w-full flex flex-col md:flex-row rounded-lg bg-background">
					<DemoPageLeft2
						userSpreadIndex={userSpreadIndex}
						demoIsComplete={demoIsComplete}
						setDemoIsComplete={setDemoIsComplete}
					/>
					<DemoPageRight2 userSpreadIndex={userSpreadIndex} demoIsComplete={demoIsComplete} />
				</div>
			)}
		</AnimatePresence>
	)
}
