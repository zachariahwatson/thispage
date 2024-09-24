"use client"

import { CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui"
import { PollActionsButton } from "@/components/ui/buttons"
import { usePoll } from "@/contexts"
import { PollPodium } from "@/components/ui/books/club/spreads/poll"
import { PageLeft } from "@/components/ui/books"
import { Vote } from "lucide-react"

interface Props {
	userSpreadIndex: number
}

export function PollPageLeft({ userSpreadIndex }: Props) {
	const pollData = usePoll()

	return (
		<PageLeft userSpreadIndex={userSpreadIndex} id={`club-${pollData?.club_id}-poll-${pollData?.id}-page-left`}>
			<PollActionsButton />
			<CardHeader className="px-4 md:px-6 relative h-full pt-2 md:pt-6">
				<CardTitle className="text-md md:text-xl flex flex-row items-center">
					poll
					{/* <svg
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
							d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
						/>
					</svg> */}
					<Vote className="size-5 md:size-6 mx-2" strokeWidth={1.5} />
				</CardTitle>
				<Separator />
				<CardTitle className="text-sm md:text-lg text-wrap break-words">{pollData?.name}</CardTitle>
				<CardDescription className="text-xs md:text-sm break-words">{pollData?.description}</CardDescription>
				<Separator />
				<PollPodium />
			</CardHeader>
		</PageLeft>
	)
}
