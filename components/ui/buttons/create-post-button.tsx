"use client"

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui"
import { CreatePostForm } from "@/components/ui/forms/create"
import { useClubMembership, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { useState } from "react"

export function CreatePostButton() {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const [createPostVisible, setCreatePostVisible] = useState<boolean>(false)

	const readingData = useReading()
	const clubMembership = useClubMembership()

	const { data: intervals } = useIntervals(clubMembership?.club.id || null, readingData?.id || null)

	const interval = (intervals && intervals[0]) || null

	const { data: userProgress } = useUserProgress(interval?.id || null, clubMembership?.id || null)
	return (
		userProgress && (
			<>
				<Sheet open={createPostVisible} onOpenChange={setCreatePostVisible}>
					<Tooltip>
						<TooltipTrigger asChild>
							<SheetTrigger>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
							</SheetTrigger>
						</TooltipTrigger>
						<TooltipContent>create post</TooltipContent>
					</Tooltip>
					<SheetContent className="sm:max-w-2xl max-w-2xl w-full space-y-4 overflow-scroll">
						<SheetHeader>
							<SheetTitle>create post</SheetTitle>
						</SheetHeader>
						<CreatePostForm setVisible={setCreatePostVisible} />
					</SheetContent>
				</Sheet>
			</>
		)
	)
}
