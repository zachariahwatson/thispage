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
import { useReading } from "@/contexts"
import { useState } from "react"

export function CreatePostButton() {
	const [createPostVisible, setCreatePostVisible] = useState<boolean>(false)
	const readingData = useReading()
	return (
		readingData?.interval?.user_progress && (
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
				<SheetContent className="sm:max-w-xl max-w-xl w-full space-y-4 overflow-scroll">
					<SheetHeader>
						<SheetTitle>create post</SheetTitle>
					</SheetHeader>
					<CreatePostForm setVisible={setCreatePostVisible} />
				</SheetContent>
			</Sheet>
		)
	)
}
