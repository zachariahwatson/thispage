"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
	Separator,
} from "@/components/ui"
import { DemoCompleteIntervalButton } from "@/components/ui/buttons"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"
import Image from "next/image"
import { Dispatch, SetStateAction, useState } from "react"

interface Props {
	readingIndex: number
	isComplete: boolean
	setIsComplete: Dispatch<SetStateAction<boolean>>
}

export function DemoReadingPageLeft({ readingIndex, isComplete, setIsComplete }: Props) {
	const MotionCard = motion(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(false)
	const isVertical = useMediaQuery("(max-width: 768px)")

	//framer motion responsive animation (turns book page flip into notepad page flip)
	const leftVariants = isVertical
		? {
				initial: { rotateX: flipOnce ? 0 : -90, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: flipOnce ? 0 : 90, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	return (
		<MotionCard
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-shadow shadow-md"
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: 0.1, delay: 0.1, ease: "easeIn" }}
			style={{ transformPerspective: 2500 }}
			onAnimationComplete={() => setFlipOnce(true)}
		>
			<div className="flex justify-center px-12 pb-16 pt-4 md:pt-8 h-full w-full">
				<Image
					className="rounded-lg h-full w-auto"
					src="/images/demo-cover.png"
					width={1519}
					height={2371}
					alt="Cover photo of The Odyssey by Homer"
					loading="eager"
				/>
			</div>

			<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-background/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_rgba(0,0,0,0.1)] backdrop-blur-md bg-background/80 rounded-none rounded-t-lg md:rounded-none md:rounded-l-lg">
				<CardHeader className="pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4">
					<CardTitle className="text-xl md:text-2xl">The Odyssey</CardTitle>
					<CardDescription className="italic">by Homer</CardDescription>
				</CardHeader>
				<div className="px-4">
					<Separator />
				</div>
				<CardContent className="pr-0 pt-6 md:pt-2 md:px-6 px-4">
					<CardDescription>read to...</CardDescription>
					<div className="flex flex-row">
						<p className="font-bold italic md:text-xl">
							p.
							<span className="text-6xl md:text-8xl not-italic">50</span>
						</p>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1}
							stroke="currentColor"
							className="w-12 md:w-14 h-12 md:h-14 self-center"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
						</svg>
						<div className="self-center">
							<DemoCompleteIntervalButton isComplete={isComplete} setIsComplete={setIsComplete} />
						</div>
					</div>
					<CardDescription className="italic">{isComplete ? "5" : "4"}/8 readers have completed</CardDescription>
				</CardContent>
				<CardFooter className="md:px-6 px-4">
					<Progress value={Math.floor((40 / 348) * 100)} className="h-2 md:h-4" />
				</CardFooter>
			</Card>
			<div className="bg-gradient-to-l from-shadow to-background py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-background px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-foreground/30">{readingIndex + 1}</p>
		</MotionCard>
	)
}
