"use client"

import { CardDescription, CardFooter, CardHeader, CardTitle, Separator } from "@/components/ui"
import { DemoIntervalAvatarGroup, DemoReadingPosts } from "@/components/ui/books/demo"
import { PageRight } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
	isComplete: boolean
}

export function DemoReadingPageRight({ userSpreadIndex, isComplete }: Props) {
	return (
		<PageRight userSpreadIndex={userSpreadIndex} id={`demo-reading-page-right`}>
			<CardHeader className="px-4 md:px-6 h-[calc(100%-4.5rem)] md:h-[calc(100%-5.5rem)] pt-3 md:pt-6">
				<CardTitle className="text-md md:text-xl">discussion</CardTitle>
				<Separator />
				<div className="flex justify-between pr-1">
					<CardDescription className="md:text-sm text-xs">share your thoughts!</CardDescription>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>
				</div>

				<DemoReadingPosts clicked={isComplete} />
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex-col w-full items-start space-y-2 md:p-6 p-4 pb-6">
				<DemoIntervalAvatarGroup isComplete={isComplete} />
			</CardFooter>
		</PageRight>
	)
}
