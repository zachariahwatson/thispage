"use client"

import { RadioGroup, ScrollArea } from "@/components/ui"
import { useClubMembership, usePoll } from "@/contexts"
import { PollItem } from "@/components/ui/books/club/spreads/poll"
import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { QueryError } from "@/utils/errors"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function PollItems() {
	const pollData = usePoll()
	const clubMembership = useClubMembership()
	const [value, setValue] = useState<string | undefined>(`${pollData?.user_vote_poll_item_id}`)
	const queryClient = useQueryClient()

	const upsertPollVoteMutation = useMutation({
		mutationFn: async (data: { member_id: number; poll_item_id: number; poll_vote_id: number | undefined }) => {
			const url = new URL(`${defaultUrl}/api/clubs/${pollData?.club_id}/polls/${pollData?.id}`)
			const response = await fetch(url, {
				method: "PUT",
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
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["polls", pollData?.club_id])
			if (body.data) {
				setValue(body.data.poll_item_id)
			}
		},
	})

	const deletePollVoteMutation = useMutation({
		mutationFn: async (data: { poll_vote_id?: number | null }) => {
			const url = new URL(
				`${defaultUrl}/api/clubs/${pollData?.club_id}/polls/${pollData?.id}/poll-votes/${pollData?.user_vote_id}`
			)
			const response = await fetch(url, {
				method: "DELETE",
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
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["polls", pollData?.club_id])
			setValue(undefined)
		},
	})

	const handleValueChange = (newValue: string) => {
		upsertPollVoteMutation.mutate({
			member_id: clubMembership?.id || -1,
			poll_item_id: Number(newValue),
			poll_vote_id: pollData?.user_vote_id ?? undefined,
		})
	}

	return (
		<div className="h-full">
			<RadioGroup defaultValue={value} value={value} onValueChange={handleValueChange}>
				<ScrollArea className="border rounded-lg min-h-[168px] h-[calc(50svh-176px)] md:h-[456px] shadow-shadow shadow-inner">
					<div className="p-3 md:p-4 w-auto h-auto space-y-2">
						{pollData?.items &&
							pollData?.items.map((item) => <PollItem key={item.id} item={item} groupValue={value} />)}
						{pollData?.user_vote_id &&
							(deletePollVoteMutation.isLoading ? (
								<Button disabled className="w-full" variant="secondary">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-6 animate-spin mr-2"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
										/>
									</svg>
									cancelling...
								</Button>
							) : (
								<Button
									className="w-full"
									variant="secondary"
									onClick={() => deletePollVoteMutation.mutate({ poll_vote_id: pollData.user_vote_id })}
								>
									cancel vote
								</Button>
							))}
					</div>
				</ScrollArea>
			</RadioGroup>
		</div>
	)
}
