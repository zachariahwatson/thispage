"use client"

import {
	BookDetails,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
	Separator,
	Sheet,
	SheetTrigger,
} from "@/components/ui"
import { DemoCompleteIntervalButton } from "@/components/ui/buttons"
import Image from "next/image"
import { Dispatch, SetStateAction } from "react"
import { PageLeft } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
	isComplete: boolean
	setIsComplete: Dispatch<SetStateAction<boolean>>
}

export function DemoReadingPageLeft({ userSpreadIndex, isComplete, setIsComplete }: Props) {
	return (
		<PageLeft userSpreadIndex={userSpreadIndex} id={`demo-reading-page-left`}>
			<CardHeader className="px-4 md:px-6 relative pt-2 md:pt-6 pb-2 md:pb-6">
				<CardTitle className="text-md md:text-xl flex flex-row items-center">
					demo reading
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-5 md:size-6 mx-2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
						/>
					</svg>
				</CardTitle>
				<Separator />
			</CardHeader>
			{/* <div className="flex justify-center px-12 pb-16"> */}
			<div className="h-[calc(100%-8.5rem)] flex justify-center items-start px-3 md:px-6">
				<Sheet>
					<SheetTrigger asChild>
						<Image
							className="rounded-sm md:rounded-lg hover:cursor-pointer object-contain w-auto h-auto max-h-full shadow-[4px_4px_6px_-1px_hsl(var(--shadow))] shadow-shadow"
							src="/images/demo-cover.png"
							width={1519}
							height={2371}
							alt="Cover photo of The Odyssey by Homer"
							loading="eager"
						/>
					</SheetTrigger>
					<BookDetails
						bookTitle="The Odyssey"
						coverUrl="/images/demo-cover.png"
						coverWidth={1519}
						coverHeight={2371}
						authors={["Homer"]}
						description="The Odyssey (/ˈɒdəsi/; Greek: Ὀδύσσεια, Odýsseia) is one of two major ancient Greek epic poems attributed to Homer. It is, in part, a sequel to the Iliad, the other work ascribed to Homer. The poem is fundamental to the modern Western canon, and is the second oldest extant work of Western literature, the Iliad being the oldest. Scholars believe it was composed near the end of the 8th century BC, somewhere in Ionia, the Greek coastal region of Anatolia. - Wikipedia"
					/>
				</Sheet>
			</div>

			<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-page/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_hsl(var(--shadow))] backdrop-blur-md bg-page/80 rounded-none rounded-t-lg md:rounded-none md:rounded-l-lg">
				<CardHeader className="pb-4 md:pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4 space-y-0">
					<CardTitle className="text-xl md:text-2xl">The Odyssey</CardTitle>
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
							<DemoCompleteIntervalButton isComplete={isComplete} setIsComplete={setIsComplete} />
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
