"use client"

import { DemoPageLeft2, DemoPageRight2 } from "@/components/ui/books/demo"
import { Spread } from "@/components/ui/books"

interface Props {
	isVisible: boolean
	userSpreadIndex: number
}

export function DemoSpread2({ isVisible, userSpreadIndex }: Props) {
	return (
		<Spread id={`demo-spread-2`} isVisible={isVisible}>
			<DemoPageLeft2 userSpreadIndex={userSpreadIndex} />
			<DemoPageRight2 userSpreadIndex={userSpreadIndex} />
		</Spread>
	)
}
