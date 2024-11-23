"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"
import { useClubMembership, useReading } from "@/contexts"
import { Reading } from "@/lib/types"
import { QueryError } from "@/utils/errors"
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
		mutationFn: async (data: { is_complete: boolean }) => {
			const url = new URL(
				`${defaultUrl}/api/users/progresses/${clubMembership?.id}/intervals/${readingData?.interval?.id}`
			)
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
		onError: (error: any, data, context) => {
			if (context) {
				queryClient.setQueryData(["readings", clubMembership?.club.id], context.previousProgress)
			}
			toast.error(error.message, { description: error.code })
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
							width={24}
							height={24}
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-16 md:w-24 h-16 md:h-24"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.25"
							stroke-linecap="round"
							stroke-linejoin="round"
							className="w-16 md:w-24 h-16 md:h-24"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
							<path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
							<path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
							<path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
							<path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
							<path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
							<path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
							<path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
							<path d="M9 12l2 2l4 -4" />
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
