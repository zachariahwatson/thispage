"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useClubMembership } from "@/contexts"
import { MemberProgress } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useUserProgress } from "@/hooks/state"

interface Props {
	readingId: number | null
	intervalId: number | null
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function CompleteIntervalButton({ readingId, intervalId }: Props) {
	const clubMembership = useClubMembership()
	const queryClient = useQueryClient()
	const { data: userProgress } = useUserProgress(intervalId, clubMembership?.id || null)
	const mutation = useMutation({
		mutationFn: (data: { is_complete: boolean }) => {
			const url = new URL(`${defaultUrl}/api/users/progresses/${clubMembership?.id}/intervals/${intervalId}`)
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
			await queryClient.cancelQueries({ queryKey: ["user progress", intervalId] })

			// Snapshot the previous value
			const previousProgress = queryClient.getQueryData(["user progress", intervalId])

			// Optimistically update to the new value
			queryClient.setQueryData(["user progress", intervalId], (old: any) => ({
				...(old || {}),
				is_complete: data.is_complete,
			}))

			// Return a context object with the snapshotted value
			return { previousProgress }
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, data, context) => {
			if (context) {
				queryClient.setQueryData(["user progress", intervalId], context.previousProgress)
			}
			toast.error("an error occurred while updating user progress :(")
		},
		onSettled: () => {
			if (!userProgress?.is_complete) {
				const choices = [
					`nice work! keep it up! 🔥`,
					`nice one! was it a good portion?`,
					`page goal completed! 🎉`,
					`justkeepreadingjustkeepreadingjustkeepreading`,
					`#slayedthatgoalpage 💅`,
					`i saw how hard you read that. nice.`,
					`nice! if you read one more page i'll give you a dollar 😏`,
					`breaking news: super reader on the loose! 🚨`,
					`this just in: reader smashes page goal! 📰`,
					`oh. you didn't have to read it THAT fast 💨`,
					`dang. i wish i could read like you 😔`,
					`wow... way to show everyone how to actually read!`,
					`you know you can take breaks... right?`,
					`pfft... what a nerd! reading??? a book??? 🤣`,
					`let me guess... you're on page ${Math.floor(Math.random() * 500)}. was i close?`,
					`nice one. now go take a break and frolic in a field.`,
					`beep boop. page goal completed. beep boop. congratulations. beep boop.`,
					`omg same, i loved that part. totally. i've read the book like 20 times.`,
					`when's the last time you did the macarena? just a thought. nice one!`,
					`when's the last time you square danced? just a thought. nice one!`,
					`nice! don't go too hard celebrating this completion! 🎉`,
					`hmmm. very interesting part of the book. hmmm yes. indeed.`,
					`is it just me or is it hotter in here since you completed the page goal? 🥵`,
					`niiiiiiiiiiiiiiiiiiiiiiiice`,
					`i think you just earned yourself a spot in the reading hall of fame.`,
				]
				toast.success(choices[Math.floor(Math.random() * choices.length)])
			}
			queryClient.invalidateQueries(["intervals", clubMembership?.club.id, readingId])
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
			//queryClient.invalidateQueries(["user progress", intervalId])
			//queryClient.invalidateQueries(["posts", clubMembership?.club.id, readingId])
		},
	})

	return (
		<Tooltip>
			<TooltipTrigger>
				<motion.div
					className="w-16 md:w-24 h-16 md:h-24 p-0 rounded-full text-primary"
					onClick={() => mutation.mutate({ is_complete: !userProgress?.is_complete || false })}
					initial={{
						scale: 1.1,
					}}
					animate={{
						scale: 1,
					}}
				>
					{userProgress?.is_complete ? (
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
				</motion.div>
			</TooltipTrigger>
			<TooltipContent>
				<p>{userProgress?.is_complete ? "un-complete reading" : "complete reading"}</p>
			</TooltipContent>
		</Tooltip>
	)
}
