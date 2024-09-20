"use client"

import { CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui"
import { DemoReadingPosts } from "@/components/ui/books/demo"
import { PageRight } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
	demoIsComplete: boolean
}

export function DemoPageRight1({ userSpreadIndex, demoIsComplete }: Props) {
	return (
		<PageRight userSpreadIndex={userSpreadIndex} id={`demo-page-right-1`}>
			<CardContent className="md:space-y-4 pt-4">
				<div className="space-y-2">
					<CardTitle className="text-md md:text-xl">
						<span className="font-black text-ring">discuss</span> readings.
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
		</PageRight>
	)
}
