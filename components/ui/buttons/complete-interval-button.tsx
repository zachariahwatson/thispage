"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"
import { useClubMembership, useReading } from "@/contexts"
import { Reading } from "@/lib/types"
import { AnimatePresence, motion } from "framer-motion"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function CompleteIntervalButton() {
	const clubMembership = useClubMembership()
	const readingData = useReading()
	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: (data: { is_complete: boolean }) => {
			const url = new URL(
				`${defaultUrl}/api/users/progresses/${clubMembership?.id}/intervals/${readingData?.interval?.id}`
			)
			return fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		// When mutate is called:
		onMutate: async (data) => {
			// Cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["readings", clubMembership?.club.id] })

			// Snapshot the previous value
			const previousProgress = queryClient.getQueryData(["readings", clubMembership?.club.id])

			// Optimistically update to the new value
			queryClient.setQueryData(["readings", clubMembership?.club.id], (old: any) => {
				return old.map((reading: Reading) => {
					if (reading?.id === readingData?.id) {
						return {
							...reading,
							interval: {
								...reading?.interval,
								user_progress: {
									...reading?.interval?.user_progress,
									is_complete: data.is_complete,
								},
							},
						}
					}
					return reading
				})
			})

			// Return a context object with the snapshotted value
			return { previousProgress }
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, data, context) => {
			if (context) {
				queryClient.setQueryData(["readings", clubMembership?.club.id], context.previousProgress)
			}
			toast.error("an error occurred while updating user progress :(")
		},
		onSettled: () => {
			if (!readingData?.interval?.user_progress?.is_complete) {
				const choices = [
					`nice work! keep it up! 🔥`,
					`nice one! was it a good portion?`,
					`goal completed! 🎉`,
					`justkeepreadingjustkeepreadingjustkeepreading`,
					`#slayedthatgoal 💅`,
					`i saw how hard you read that. nice.`,
					`nice! if you read one more page i'll give you a dollar 😏`,
					`breaking news: super reader on the loose! 🚨`,
					`this just in: reader smashes goal! 📰`,
					`oh. you didn't have to read it THAT fast 💨`,
					`dang. i wish i could read like you 😔`,
					`wow... way to show everyone how to actually read!`,
					`you know you can take breaks... right?`,
					`pfft... what a nerd! reading??? a book??? 🤣`,
					`let me guess... you're on page ${Math.floor(Math.random() * 500)}. was i close?`,
					`nice one. now go take a break and frolic in a field.`,
					`beep boop. goal completed. beep boop. congratulations. beep boop.`,
					`omg same, i loved that part. totally. i've read the book like 20 times.`,
					`when's the last time you did the macarena? just a thought. nice one!`,
					`when's the last time you square danced? just a thought. nice one!`,
					`nice! don't go too hard celebrating this completion! 🎉`,
					`hmmm. very interesting part of the book. hmmm yes. indeed.`,
					`is it just me or is it hotter in here since you completed the goal? 🥵`,
					`niiiiiiiiiiiiiiiiiiiiiiiice`,
					`i think you just earned yourself a spot in the reading hall of fame.`,
				]
				toast.success(choices[Math.floor(Math.random() * choices.length)])
			}
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
		},
	})

	return readingData?.interval?.user_progress ? (
		<Tooltip>
			<TooltipTrigger>
				<div
					className="w-16 md:w-24 h-16 md:h-24 p-0 rounded-full text-primary"
					onClick={() => mutation.mutate({ is_complete: !readingData?.interval?.user_progress?.is_complete || false })}
				>
					{readingData?.interval?.user_progress?.is_complete ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-16 md:w-24 h-16 md:h-24"
						>
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
								clipRule="evenodd"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-16 md:w-24 h-16 md:h-24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					)}
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<p>{readingData?.interval?.user_progress?.is_complete ? "un-complete reading" : "complete reading"}</p>
			</TooltipContent>
		</Tooltip>
	) : (
		<div className="w-16 md:w-24 h-16 md:h-24 p-0 rounded-full text-secondary">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-16 md:w-24 h-16 md:h-24 animate-spin"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
				/>
			</svg>
		</div>
	)
}
