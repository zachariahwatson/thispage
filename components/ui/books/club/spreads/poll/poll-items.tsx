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
}

export function PollItems({ toggleGroupRef }: Props) {
	const pollData = usePoll()
	const [values, setValues] = useState<string[] | undefined>(
		pollData?.user_votes.map((vote) => vote.poll_item_id.toString())
	)

	return (
		<ToggleGroup
			type="multiple"
			value={values}
			defaultValue={values}
			onValueChange={setValues}
			className="h-full"
			ref={toggleGroupRef}
		>
			<div className="border rounded-lg h-full shadow-shadow shadow-inner relative overflow-y-scroll w-full">
				<div className="p-3 md:p-4 w-auto h-auto space-y-2">
					{pollData?.items &&
						pollData?.items.map((item) => <PollItem key={item.id} item={item} groupValues={values} />)}
				</div>
			</div>
		</ToggleGroup>
	)
}
