"use client"

import { Card } from "@/components/ui"
import { useFirstLoadAnimation } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"
import { useState } from "react"
import { Spine } from "@/components/ui/books"

interface Props {
	userSpreadIndex?: number | undefined
	id?: string
	children?: React.ReactNode
	disableAnimation?: boolean | undefined
}

export function PageLeft({ userSpreadIndex = 0, id, children, disableAnimation = false }: Props) {
	const MotionCard = motion.create(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(disableAnimation)
	const isVertical = useMediaQuery("(max-width: 768px)")
	const firstLoad = useFirstLoadAnimation()

	//framer motion responsive animation (turns book page flip into notepad page flip)
	const leftVariants = isVertical
		? {
				initial: { rotateX: flipOnce ? 0 : firstLoad?.firstLoad ? -90 : -180, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: flipOnce ? 0 : firstLoad?.firstLoad ? 90 : 180, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	return (
		<MotionCard
			id={id}
			className={`bg-page flex-1 h-1/2 md:h-full md:w-1/2 relative rounded-b-none md:rounded-b-lg md:rounded-tr-none md:rounded-br-none shadow-none border-none ${
				flipOnce ? "border-none" : "border-b-0 md:border-b md:border-r-0"
			}`}
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: firstLoad?.firstLoad ? 0.1 : 0.2, delay: 0.1, ease: "easeIn" }}
			style={{ transformPerspective: 2500 }}
			onAnimationComplete={() => {
				setFlipOnce(true)
			}}
			onUpdate={(latest) => {
				// Check if the animation has progressed past a certain point
				if (
					!firstLoad?.firstLoad &&
					((latest.rotateY && Number(latest.rotateY) < 90) || (latest.rotateX && Number(latest.rotateX) > -90))
				) {
					firstLoad?.setFirstLoad(true)
				}
			}}
		>
			{firstLoad?.firstLoad && children}
			<Spine dir="left" />
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
