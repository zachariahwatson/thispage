"use client"

import { Card, CardContent, CardDescription, CardFooter, CardTitle, Progress } from "@/components/ui"
import { DemoCompleteIntervalButton } from "@/components/ui/buttons"
import { Dispatch, SetStateAction } from "react"
import { PageLeft } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
	demoIsComplete: boolean
	setDemoIsComplete: Dispatch<SetStateAction<boolean>>
	demoClicked: boolean
	setDemoClicked: Dispatch<SetStateAction<boolean>>
}

export function DemoPageLeft1({
	userSpreadIndex,
	demoIsComplete,
	setDemoIsComplete,
	demoClicked,
	setDemoClicked,
}: Props) {
	return (
		<PageLeft userSpreadIndex={userSpreadIndex} id={`demo-page-left-1`}>
			<CardContent className="md:space-y-4 pt-4">
				<div className="space-y-2">
					<CardTitle className="text-md md:text-xl">
						<span className="font-black text-ring">complete</span> group reading goals with automatic increments.
					</CardTitle>
					<CardDescription className="text-xs md:text-sm">
						once all readers have completed the reading goal, it will be automatically incremented by a custom amount.
					</CardDescription>
				</div>
				<div className="flex justify-center">
					<div className="flex justify-center absolute pt-4 md:left-4">
						<div className="absolute w-16 h-8 bg-primary/80 z-10 top-1 -rotate-2 shadow-md rounded-[4px]" />
						<Card className="w-full border-border -space-y-4 md:space-y-0 shadow-shadow shadow-md backdrop-blur-md bg-page/80 rounded-lg rotate-3 pb-0">
							<CardContent className="pr-0 pt-2 md:px-6 px-4">
								<CardDescription className="text-xs md:text-sm">read to...</CardDescription>
								<div className="flex flex-row">
									<p className="font-bold italic md:text-xl">
										chapter.
										<span className="text-6xl md:text-8xl not-italic">{demoClicked ? "8" : "7"}</span>
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
										<DemoCompleteIntervalButton
											isComplete={demoIsComplete}
											setIsComplete={setDemoIsComplete}
											clicked={demoClicked}
											setClicked={setDemoClicked}
										/>
									</div>
								</div>
								<CardDescription className="italic text-xs md:text-sm">
									{!demoClicked ? (demoClicked ? "0" : "4") : demoIsComplete ? "1" : "0"}/5 readers have completed
								</CardDescription>
							</CardContent>
							<CardFooter className="md:px-6 px-4 pb-2">
								<Progress value={Math.floor(((demoClicked ? 306 : 243) / 640) * 100)} className="h-2 md:h-4" />
							</CardFooter>
						</Card>
					</div>
					<div className="justify-center absolute pt-4 hidden top-[55%] left-12 md:flex">
						<div className="absolute w-16 h-8 bg-primary/80 z-10 top-1 rotate-1 shadow-md rounded-[4px]" />
						<Card className="w-full border-border -space-y-4 md:space-y-0 shadow-shadow shadow-md backdrop-blur-md bg-page/80 rounded-lg -rotate-2 pb-0">
							<CardContent className="pr-0 pt-2 md:px-6 px-4">
								<CardDescription className="text-xs md:text-sm">read to...</CardDescription>
								<div className="flex flex-row">
									<p className="font-bold italic md:text-xl">
										p.
										<span className="text-6xl md:text-8xl not-italic">{demoClicked ? "60" : "50"}</span>
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
										<DemoCompleteIntervalButton
											isComplete={demoIsComplete}
											setIsComplete={setDemoIsComplete}
											clicked={demoClicked}
											setClicked={setDemoClicked}
										/>
									</div>
								</div>
								<CardDescription className="italic text-xs md:text-sm">
									{!demoClicked ? (demoClicked ? "0" : "4") : demoIsComplete ? "1" : "0"}/5 readers have completed
								</CardDescription>
							</CardContent>
							<CardFooter className="md:px-6 px-4 pb-2">
								<Progress value={Math.floor(((demoClicked ? 60 : 50) / 348) * 100)} className="h-2 md:h-4" />
							</CardFooter>
						</Card>
					</div>
				</div>
			</CardContent>
		</PageLeft>
	)
}
