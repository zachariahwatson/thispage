"use client"

import { Card, CardContent, CardDescription, CardFooter, CardTitle, Separator } from "@/components/ui"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"
import { DemoReadingPosts } from "./demo-reading-posts"

interface Props {
	userSpreadIndex: number
	demoIsComplete: boolean
}

export function DemoPageRight1({ userSpreadIndex, demoIsComplete }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const MotionCard = motion(Card)
	//console.log(interval)

	//fix initial and animate
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
			className="bg-page flex-1 h-1/2 md:h-full md:w-1/2 relative border-t-0 rounded-t-none md:border-t md:rounded-t-lg md:border-l-0 md:rounded-tl-none md:rounded-bl-none shadow-shadow-dark shadow-md"
			variants={rightVariants}
			exit="exit"
			transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
		>
			<CardContent className="md:space-y-4 pt-4">
				<div className="space-y-2">
					<CardTitle className="text-md md:text-xl">
						<span className="font-black text-primary">discuss</span> readings.
					</CardTitle>
					<CardDescription className="text-xs md:text-sm">
						create posts with spoiler tags that reveal once the reader has completed the interval.
					</CardDescription>

					<DemoReadingPosts clicked={demoIsComplete} />
				</div>
			</CardContent>
			<CardFooter className="absolute bottom-0 right-12 flex-col items-center space-y-2 md:p-6 p-4 pb-6">
				<CardTitle className="flex flex-row text-md md:text-xl">flip to the next page 👉</CardTitle>
			</CardFooter>
			<div className="bg-gradient-to-r from-shadow to-page py-2 hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-b from-shadow to-page px-2 block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
