"use client"

import { RadioGroup, ScrollArea } from "@/components/ui"
import { usePoll } from "@/contexts"
import { PollItem } from "@/components/ui/books/club/spreads/poll"

export function PollItems() {
	const pollData = usePoll()

	return (
		<div className="h-full">
			<RadioGroup>
				<ScrollArea className="border rounded-lg min-h-[124px] h-[calc(50svh-164px)] md:h-[456px] shadow-shadow shadow-inner">
					<div className="p-3 md:p-4 w-auto h-auto space-y-2">
						{pollData?.items && pollData?.items.map((item) => <PollItem key={item.id} item={item} />)}
					</div>
				</ScrollArea>
			</RadioGroup>
		</div>
	)
}
