"use client"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Separator,
} from "@/components/ui"
import { Button, CreatePollItemButton } from "@/components/ui/buttons"
import { useMediaQuery } from "@/hooks"
import { motion } from "framer-motion"
import { PollItems } from "@/components/ui/books/club/spreads/poll"
import { useClubMembership, usePoll } from "@/contexts"
import Countdown from "react-countdown"
import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { QueryError } from "@/utils/errors"
import { toast } from "sonner"

interface Props {
	userSpreadIndex: number
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function PollPageRight({ userSpreadIndex }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const MotionCard = motion(Card)
	const pollData = usePoll()
	const endDate = new Date(pollData?.end_date || "")
	const [values, setValues] = useState<string[] | undefined>(
		pollData?.user_votes.map((vote) => vote.poll_item_id.toString())
	)
	const clubMembership = useClubMembership()
	const [continueVisible, setContinueVisible] = useState<boolean>(false)
	const queryClient = useQueryClient()

	const updatePollStatusMutation = useMutation({
		mutationFn: async (data: { editor_member_id: number; status: "voting" }) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/polls/${pollData?.id}`)
			const response = await fetch(url, {
				method: "PATCH",
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
			setContinueVisible(false)
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["polls", clubMembership?.club.id])
		},
	})

	const insertPollVotesMutation = useMutation({
		mutationFn: async (data: { member_id: number; poll_item_id: number }[]) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/polls/${pollData?.id}/poll-votes`)
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
			setContinueVisible(false)
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["polls", clubMembership?.club.id])
		},
	})

	const deletePollVotesMutation = useMutation({
		mutationFn: async (data: { member_id: number; poll_item_ids: number[] }) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/polls/${pollData?.id}/poll-votes`)
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
		onSettled: () => {
			setContinueVisible(false)
		},
		onSuccess: (body: any) => {
			toast.success(body.message)
			queryClient.invalidateQueries(["polls", clubMembership?.club.id])
		},
	})

	//fix initial and animate
	const rightVariants = isVertical
		? {
				initial: { rotateX: 0, originY: 0, zIndex: 2 },
				animate: { rotateX: 90, originY: 0, zIndex: 2 },
				exit: { rotateX: 90, originY: 0, zIndex: 2 },
		  }
		: {
				initial: { rotateY: 0, originX: 0, zIndex: 2 },
				animate: { rotateY: -90, originX: 0, zIndex: 2 },
				exit: { rotateY: -90, originX: 0, zIndex: 2 },
		  }

	return (
		<MotionCard
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 relative border-t-0 rounded-t-none md:border-t md:rounded-t-lg md:border-l-0 md:rounded-tl-none md:rounded-bl-none shadow-shadow shadow-md"
			variants={rightVariants}
			exit="exit"
			transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
		>
			<CardHeader className="px-4 md:px-6 h-[calc(100%-114px)] md:h-[calc(100%-118px)] pt-4 md:pt-6">
				<div className="flex flex-row justify-between">
					<CardTitle className="text-md md:text-xl">
						{pollData?.status === "selection"
							? "add books"
							: pollData?.status === "voting"
							? "vote books"
							: "poll finished!"}
					</CardTitle>
					{pollData?.end_date && (
						<CardDescription className="flex flex-row items-center justify-center space-x-2">
							<span>
								<Countdown date={endDate}>
									<span>poll ended!</span>
								</Countdown>
							</span>
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
									d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
						</CardDescription>
					)}
				</div>
				<Separator />
				<div className="flex justify-between pr-1">
					<CardDescription className="md:text-sm text-xs">
						{pollData?.status === "selection"
							? "add a book you think others would enjoy."
							: pollData?.status === "voting" && "which books would you be okay with reading?"}
					</CardDescription>
					<CreatePollItemButton />
				</div>
				<PollItems values={values} setValues={setValues} />
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex flex-col w-full items-center space-y-2 md:p-6 p-4 pb-4 md:pb-4">
				{pollData?.status === "selection" && clubMembership?.role === "admin" && (
					<AlertDialog open={continueVisible} onOpenChange={setContinueVisible}>
						<AlertDialogTrigger asChild>
							<Button>
								move to voting phase{" "}
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
										d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
									/>
								</svg>
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									are you sure you want to move to the voting phase in {pollData.name}?
								</AlertDialogTitle>
								<AlertDialogDescription>
									this action cannot be undone and poll items will be unable to be added or removed.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={updatePollStatusMutation.isLoading}>cancel</AlertDialogCancel>
								{updatePollStatusMutation.isLoading ? (
									<Button disabled>
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
										continuing...
									</Button>
								) : (
									<AlertDialogAction
										onClick={(e) => {
											updatePollStatusMutation.mutate({ editor_member_id: clubMembership?.id || -1, status: "voting" })
											e.preventDefault()
										}}
									>
										continue
									</AlertDialogAction>
								)}
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
				{pollData?.status === "voting" &&
					(pollData.user_votes.length === 0 ? (
						insertPollVotesMutation.isLoading ? (
							<Button className="w-40" disabled>
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
								voting...
							</Button>
						) : (
							<Button
								className="w-40"
								onClick={(e) => {
									e.preventDefault()
									if (values && clubMembership?.id) {
										const pollVotes = values.map((pollItemId) => ({
											member_id: clubMembership.id,
											poll_item_id: parseInt(pollItemId),
										}))
										insertPollVotesMutation.mutate(pollVotes)
									}
								}}
								disabled={!values || values.length === 0}
							>
								vote
							</Button>
						)
					) : deletePollVotesMutation.isLoading ? (
						<Button className="w-40" disabled variant="outline">
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
							canceling...
						</Button>
					) : (
						<Button
							className="w-40"
							variant="outline"
							onClick={(e) => {
								e.preventDefault()
								if (values) {
									const pollItemIds = values.map((pollItemId) => parseInt(pollItemId))
									deletePollVotesMutation.mutate({ member_id: clubMembership?.id ?? -1, poll_item_ids: pollItemIds })
								}
							}}
						>
							cancel vote
						</Button>
					))}
			</CardFooter>
			<div className="bg-gradient-to-r from-shadow to-background py-2 hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-b from-shadow to-background px-2 block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
