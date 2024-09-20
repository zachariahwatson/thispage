"use client"

import { AnimatePresence, motion } from "framer-motion"

interface Props {
	id?: string
	children?: React.ReactNode
	isVisible: boolean
}

export function Spread({ id, children, isVisible }: Props) {
	return (
		<AnimatePresence mode="popLayout">
			{isVisible && (
				<div id={id} className="h-full flex flex-col md:flex-row">
					{children}
				</div>
			)}
		</AnimatePresence>
	)
}
