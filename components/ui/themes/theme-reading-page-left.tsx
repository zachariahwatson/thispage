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
import { ThemeCompleteIntervalButton } from "@/components/ui/buttons"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import { PageLeft } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
	isComplete: boolean
	setIsComplete: Dispatch<SetStateAction<boolean>>
}

export function ThemeReadingPageLeft({ userSpreadIndex, isComplete, setIsComplete }: Props) {
	return (
		<PageLeft userSpreadIndex={userSpreadIndex}>
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

			<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-page/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_hsl(var(--shadow))] backdrop-blur-md bg-page/80 rounded-none rounded-t-lg md:rounded-none md:rounded-l-lg">
				<CardHeader className="pb-4 md:pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4 space-y-0">
					<CardTitle className="text-xl md:text-2xl">Demo Reading</CardTitle>
					<CardDescription className="italic">by Homer</CardDescription>
				</CardHeader>
				<div className="px-4 pt-2 md:pt-0">
					<Separator />
				</div>
				<CardContent className="pr-0 pt-5 md:pt-2 md:px-6 px-4">
					<CardDescription>read to...</CardDescription>
					<div className="flex flex-row">
						<p className="font-bold italic md:text-xl">
							book.
							<span className="text-6xl md:text-8xl not-italic">12</span>
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
							<ThemeCompleteIntervalButton isComplete={isComplete} setIsComplete={setIsComplete} />
						</div>
					</div>
					<CardDescription className="italic">{isComplete ? "5" : "4"}/8 readers have completed</CardDescription>
				</CardContent>
				<CardFooter className="md:px-6 px-4">
					<Progress value={Math.floor((40 / 348) * 100)} className="h-2 md:h-4" />
				</CardFooter>
			</Card>
		</PageLeft>
	)
}
