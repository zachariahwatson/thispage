"use client"

import { CardFooter, CardHeader, CardTitle } from "@/components/ui"
import { IntervalAvatarGroup, ReadingPosts } from "@/components/ui/books/club/spreads/reading"
import { CreatePostButton } from "@/components/ui/buttons"
import { useReading } from "@/contexts"
import { PageRight } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
}

export function ReadingPageRight({ userSpreadIndex }: Props) {
	const readingData = useReading()

	//concat user progress to intervals
	const memberProgresses = [readingData?.interval?.user_progress].concat(
		readingData?.interval?.member_interval_progresses
	)

	return (
		<PageRight
			userSpreadIndex={userSpreadIndex}
			id={`club-${readingData?.club_id}-reading-${readingData?.id}-page-right`}
		>
			<CardHeader className="px-4 md:px-6 h-[calc(100%-6.25rem)] md:h-[calc(100%-118px)] pt-4 md:pt-6">
				<div className="flex justify-between pr-1">
					<CardTitle className="text-md md:text-xl">discussion</CardTitle>
					<CreatePostButton />
				</div>

				<ReadingPosts
					redactSpoilers={
						readingData?.interval?.user_progress ? !readingData?.interval?.user_progress.is_complete : true
					}
					intervalDate={readingData?.interval?.created_at || ""}
				/>
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex-col w-full items-start space-y-2 md:p-6 p-4 pb-6">
				{memberProgresses && <IntervalAvatarGroup progresses={memberProgresses} />}
			</CardFooter>
		</PageRight>
	)
}
