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
import { AddPollItemForm, CreatePostForm } from "@/components/ui/forms/create"
import { useClubMembership, usePoll } from "@/contexts"
import { Database } from "@/lib/types"
import { QueryError } from "@/utils/errors"
import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function CreatePollItemButton() {
	const [createPollItemVisible, setCreatePollItemVisible] = useState<boolean>(false)
	const clubMembership = useClubMembership()
	const pollData = usePoll()
	const queryClient = useQueryClient()
	const endDate = new Date(pollData?.end_date || "")

	const pollItemMutation = useMutation({
		mutationFn: async (data: {
			book: {
				open_library_id: string
				title?: string | undefined
				description?: string | undefined
				authors?: string[] | undefined
				page_count?: number | undefined
				cover_image_url?: string | undefined
			}
			creator_member_id: number | null
			poll_id: number
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/polls/${pollData?.id}/poll-items`)
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			if (!response.ok) {
				const body = await response.json()
				throw new QueryError(body.message, body.code)
			}

			return await response.json()
		},
		onError: (error: any) => {
			toast.error(error.message, { description: error.code })
		},
		onSettled: () => {
			setCreatePollItemVisible(false)
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["polls", clubMembership?.club.id])
		},
	})
	return (!pollData?.is_locked || clubMembership?.role === "admin") && pollData?.status === "selection" ? (
		<Sheet open={createPollItemVisible} onOpenChange={setCreatePollItemVisible}>
			<Tooltip>
				<TooltipTrigger asChild>
					<SheetTrigger disabled={pollData?.user_has_poll_item && clubMembership?.role !== "admin"}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className={`${pollData?.user_has_poll_item && clubMembership?.role !== "admin" && "text-muted"} size-6`}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					</SheetTrigger>
				</TooltipTrigger>
				<TooltipContent>
					{pollData?.user_has_poll_item && clubMembership?.role !== "admin"
						? "you have already created a poll item"
						: "add a poll item"}
				</TooltipContent>
			</Tooltip>
			<SheetContent className="sm:max-w-xl max-w-xl w-full space-y-4 overflow-scroll">
				<SheetHeader>
					<SheetTitle>add a poll item</SheetTitle>
				</SheetHeader>
				<AddPollItemForm mutation={pollItemMutation} setVisible={setCreatePollItemVisible} />
			</SheetContent>
		</Sheet>
	) : (
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
				d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
			/>
		</svg>
	)
}
