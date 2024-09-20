"use client"

import { DemoPageLeft1, DemoPageRight1 } from "@/components/ui/books/demo"
import { useState } from "react"
import { Spread } from "@/components/ui/books"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function DemoSpread1({ isVisible, userSpreadIndex }: Props) {
	const [demoIsComplete, setDemoIsComplete] = useState<boolean>(false)
	const [demoClicked, setDemoClicked] = useState<boolean>(false)
	return (
		<Spread id={`demo-spread-1`} isVisible={isVisible}>
			<DemoPageLeft1
				userSpreadIndex={userSpreadIndex}
				demoIsComplete={demoIsComplete}
				setDemoIsComplete={setDemoIsComplete}
				demoClicked={demoClicked}
				setDemoClicked={setDemoClicked}
			/>
			<DemoPageRight1 userSpreadIndex={userSpreadIndex} demoIsComplete={demoClicked} />
		</Spread>
	)
}
