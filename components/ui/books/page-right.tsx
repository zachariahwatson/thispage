"use client"

import { Card } from "@/components/ui"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"
import { Spine } from "@/components/ui/books"
import { cn } from "@/lib/utils"

interface Props {
	userSpreadIndex?: number | undefined
	id?: string
	children?: React.ReactNode
	className?: string
}

export function PageRight({ userSpreadIndex = 0, id, children, className }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const MotionCard = motion.create(Card)

	const rightVariants = isVertical
		? {
				initial: { rotateX: 0, originY: 0, zIndex: 2 },
				animate: { rotateX: 90, originY: 0, zIndex: 2 },
				exit: { rotateX: 90, originY: 0, zIndex: 2 },
		  }
		: {
				initial: { rotateY: 0, originX: 0, zIndex: 2 },
				animate: { rotateY: -90, originX: 0, zIndex: 2 },
				exit: { rotateY: -90, originX: 0, zIndex: 2 },
		  }

	return (
		<MotionCard
			id={id}
			className={cn(
				"bg-page flex-1 h-1/2 md:h-full md:w-1/2 rounded-t-none md:rounded-t-lg md:rounded-tl-none md:rounded-bl-none relative shadow-none border-none",
				className
			)}
			variants={rightVariants}
			exit="exit"
			transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
		>
			{children}
			<Spine dir="right" stitching />
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
