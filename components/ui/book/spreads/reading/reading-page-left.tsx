"use client"

import { ReadingType } from "@/utils/types"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Progress } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import Image from "next/image"

interface Props {
	readingData: ReadingType
}

export function ReadingPageLeft({ readingData }: Props) {
	// const test = new Date(readingData.intervalStartDate)
	// console.log(test)

	useEffect(() => {
		// const getPosts = async () => {
		// 	setPosts((await getReadingPosts({ readingId: readingData.id })) as PostType[])
		// }
		// getPosts().catch(console.error)
		// const getMemberIntervals = async () => {
		// 	setMemberIntervals((await getReadingMemberIntervals({ readingId: readingData.id })) as IntervalType[])
		// }
		// getMemberIntervals().catch(console.error)
	}, [])

	return (
		<Card className="flex-1 relative">
			<CardContent className="flex justify-center">
				<Image
					className="absolute bottom-0 h-full w-auto p-6 md:p-12 rounded-[64px]"
					src={readingData.book.imageUrl}
					width={readingData.book.imageWidth}
					height={readingData.book.imageHeight}
					alt={
						"Cover photo of " +
						readingData.book.title +
						" by " +
						readingData.book.authors.map((author, i) => {
							if (i === readingData.book.authors.length - 1) {
								return author
							} else if (i === readingData.book.authors.length - 2) {
								return author + " and "
							} else {
								return author + ", "
							}
						})
					}
				/>
			</CardContent>
			<Card className="absolute bottom-0 w-full rounded-tr-none rounded-tl-none border-b-0 border-l-0 border-r-0 -space-y-4 md:space-y-0">
				<CardHeader>
					<CardTitle>{readingData.book.title}</CardTitle>
					<CardDescription className="italic">
						by{" "}
						{readingData.book.authors.map((author, i) => {
							if (i === readingData.book.authors.length - 1) {
								return author
							} else if (i === readingData.book.authors.length - 2) {
								return author + " and "
							} else {
								return author + ", "
							}
						})}
					</CardDescription>
				</CardHeader>
				<CardContent className="pr-0">
					<div className="flex flex-row">
						<p className="font-bold">
							p. <span className="text-6xl md:text-8xl">{readingData.currentPage}</span>
						</p>
						<div className="flex flex-row justify-center items-center grow">
							<Button>complete</Button>
						</div>
					</div>
					{readingData.intervalType === "SCHEDULED" ? <CardDescription>test</CardDescription> : ""}
				</CardContent>
				<CardFooter>
					<Progress value={Math.floor((readingData.currentPage / readingData.book.pageCount) * 100)} className="h-2" />
				</CardFooter>
			</Card>
		</Card>
	)
}
