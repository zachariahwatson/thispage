"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui"
import { PollPodiumBook } from "@/components/ui/books/club/spreads/poll"
import { usePoll } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import Image from "next/image"
import { useEffect, useRef } from "react"

export function PollPodium() {
	const pollData = usePoll()
	const topThree = pollData?.items.toSorted((a, b) => b.poll_votes.length - a.poll_votes.length).slice(0, 3) ?? []
	const totalVotes = pollData?.items.reduce((total, item) => total + item.poll_votes.length, 0)
	const flexBoxRef = useRef<HTMLDivElement | null>(null)

	return (
		<div ref={flexBoxRef} className="flex flex-row flex-grow items-end max-h-1/4">
			<div className="bg-secondary flex-1 h-1/3 rounded-l-sm md:rounded-l-md border-border border-[1px] border-r-secondary flex justify-center items-start md:pt-2 relative">
				<PollPodiumBook flexBoxRef={flexBoxRef} item={topThree[1]} />
				{topThree[1]?.poll_votes.length > 0 && pollData?.user_votes && pollData?.user_votes.length > 0 && (
					<p className="text-secondary-foreground">
						{totalVotes ? Math.trunc((topThree[1]?.poll_votes.length / totalVotes) * 100) : 0}%
					</p>
				)}
			</div>
			<div className="flex flex-col flex-1 h-1/2">
				<div className="bg-secondary h-1/3 rounded-t-sm md:rounded-t-md border-border border-[1px] border-b-secondary flex justify-center items-start md:pt-2 relative">
					<PollPodiumBook flexBoxRef={flexBoxRef} item={topThree[0]} winner />
					{topThree[0]?.poll_votes.length > 0 && pollData?.user_votes && pollData?.user_votes.length > 0 && (
						<p className="text-secondary-foreground">
							{totalVotes ? Math.trunc((topThree[0]?.poll_votes.length / totalVotes) * 100) : 0}%
						</p>
					)}
				</div>
				<div className="flex flex-row h-2/3">
					<div className="bg-secondary border-border border-b-[1px] w-1/2"></div>
					<div className="flex flex-col w-1/2">
						<div className="bg-secondary border-border border-r-[1px] h-1/4 w-full"></div>
						<div className="bg-secondary border-border border-b-[1px] h-3/4 w-full"></div>
					</div>
				</div>
			</div>
			<div className="bg-secondary flex-1 h-1/4 rounded-r-sm md:rounded-r-md border-border border-[1px] border-l-secondary flex justify-center items-start md:pt-2 relative">
				<PollPodiumBook flexBoxRef={flexBoxRef} item={topThree[2]} />
				{topThree[2]?.poll_votes.length > 0 && pollData?.user_votes && pollData?.user_votes.length > 0 && (
					<p className="text-secondary-foreground">
						{totalVotes ? Math.trunc((topThree[2]?.poll_votes.length / totalVotes) * 100) : 0}%
					</p>
				)}
			</div>
		</div>
	)
}
