"use client"

import { CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui"
import { PollActionsButton } from "@/components/ui/buttons"
import { usePoll } from "@/contexts"
import { PollPodium } from "@/components/ui/books/club/spreads/poll"
import { PageLeft } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
}

export function PollPageLeft({ userSpreadIndex }: Props) {
	const pollData = usePoll()

	return (
		<PageLeft userSpreadIndex={userSpreadIndex} id={`club-${pollData?.club_id}-poll-${pollData?.id}-page-left`}>
			<PollActionsButton />
			<CardHeader className="px-4 md:px-6 relative h-full pt-4 md:pt-6">
				<CardTitle className="text-md md:text-xl flex flex-row items-center">
					poll
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="size-4 md:size-6 mx-2"
					>
						<path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
					</svg>
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
