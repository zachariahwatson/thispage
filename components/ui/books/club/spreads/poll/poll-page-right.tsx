"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle, Separator } from "@/components/ui"
import { CreatePollItemButton } from "@/components/ui/buttons"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"
import { PollItems } from "@/components/ui/books/club/spreads/poll"
import { usePoll } from "@/contexts"
import Countdown from "react-countdown"

interface Props {
	userSpreadIndex: number
}

export function PollPageRight({ userSpreadIndex }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const MotionCard = motion(Card)
	const pollData = usePoll()
	const endDate = new Date(pollData?.end_date || "")

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
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-t-0 rounded-t-none md:border-t md:rounded-t-lg md:border-l-0 md:rounded-tl-none md:rounded-bl-none shadow-shadow shadow-md"
			variants={rightVariants}
			exit="exit"
			transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
		>
			<CardHeader className="px-4 md:px-6 h-[calc(100%-116px)]">
				<div className="flex justify-between pr-1">
					<CardTitle className="text-xl">
						books <span className="font-normal text-muted-foreground">| poll</span>
					</CardTitle>
					<CreatePollItemButton />
				</div>
				<PollItems />
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex-col w-full items-start space-y-2 md:p-6 p-4 pb-6">
				<CardDescription className="flex flex-row items-center justify-center space-x-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>

					<span>
						{/* {endDate
							.toLocaleDateString(undefined, {
								year: "numeric",
								month: "long",
								day: "numeric",
							})
							.toLowerCase()} */}
						<Countdown date={endDate}>
							<span>poll ended!</span>
						</Countdown>
					</span>
				</CardDescription>
			</CardFooter>
			<div className="bg-gradient-to-r from-shadow to-background py-2 hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-b from-shadow to-background px-2 block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
