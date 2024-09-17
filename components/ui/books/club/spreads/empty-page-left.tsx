"use client"

import { Card, Separator } from "@/components/ui"
import { useFirstLoadAnimation } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"
import { useState } from "react"

interface Props {
	userSpreadIndex: number
}

export function EmptyPageLeft({ userSpreadIndex }: Props) {
	const MotionCard = motion(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(false)
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
			className="bg-page flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-shadow-dark shadow-md"
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: 0.1, delay: 0.1, ease: "easeIn" }}
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
			<div className="p-4 flex justify-center items-center w-full h-full">
				<p className="text-muted-foreground">hmm... no pages... a lil empty in here...</p>
			</div>
			<div className="bg-gradient-to-l from-shadow to-page py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-page px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
