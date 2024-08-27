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
import { CreateInviteForm } from "@/components/ui/forms/create"
import { useMediaQuery } from "@/hooks"
import { useState } from "react"

export function CreateInviteButton() {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const [createInviteVisible, setCreateInviteVisible] = useState<boolean>(false)
	return (
		<>
			<Sheet open={createInviteVisible} onOpenChange={setCreateInviteVisible}>
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
					<TooltipContent>create invite code</TooltipContent>
				</Tooltip>
				<SheetContent className="sm:max-w-2xl max-w-2xl w-full space-y-4 overflow-scroll">
					<SheetHeader>
						<SheetTitle>create invite code</SheetTitle>
					</SheetHeader>
					<CreateInviteForm setVisible={setCreateInviteVisible} />
				</SheetContent>
			</Sheet>
		</>
	)
}
