"use client"

import { ToggleGroup } from "@/components/ui"
import { usePoll } from "@/contexts"
import { PollItem } from "@/components/ui/books/club/spreads/poll"
import { MutableRefObject, useEffect, useState } from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	toggleGroupRef: MutableRefObject<React.ElementRef<typeof ToggleGroupPrimitive.Root> | null>
	timerComplete: boolean
}

export function PollItems({ toggleGroupRef, timerComplete }: Props) {
	const pollData = usePoll()
	const [values, setValues] = useState<string[] | undefined>(
		pollData?.user_votes.map((vote) => vote.poll_item_id.toString())
	)

	return (
		<div className="border rounded-lg h-full shadow-shadow shadow-inner relative overflow-y-scroll w-full">
			<ToggleGroup type="multiple" value={values} defaultValue={values} onValueChange={setValues} ref={toggleGroupRef}>
				<div className="p-3 md:p-4 w-full h-auto space-y-2">
					{pollData?.items &&
						(pollData.items.length > 0 ? (
							pollData?.items.map((item) => (
								<PollItem key={item.id} item={item} groupValues={values} timerComplete={timerComplete} />
							))
						) : (
							<div className="w-full h-full flex justify-center items-center">
								<p className="text-muted-foreground">🦗*crickets*🦗</p>
							</div>
						))}
				</div>
			</ToggleGroup>
		</div>
	)
}
