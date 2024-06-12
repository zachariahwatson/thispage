"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { MemberProgress } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"

interface Props {
	clubId: number | null
	readingId: number | null
	memberId: number
	intervalId: number | null
	userProgress: MemberProgress
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function CompleteIntervalButton({ clubId, readingId, memberId, intervalId, userProgress }: Props) {
	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: (data: { is_complete: boolean }) => {
			const url = new URL(`${defaultUrl}/api/users/progresses/${memberId}/intervals/${intervalId}`)
			return fetch(url, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			if (!userProgress?.is_complete) {
				const choices = [
					`oooo you're on go mode! keep it up! 🔥`,
					`nice one! was it a good interval?`,
					`reading interval completed! 🎉`,
					`justkeepreadingjustkeepreadingjustkeepreading`,
					`#slayedthatinterval 💅`,
					`i saw how hard you read that. nice.`,
					`nice! if you read one more page i'll give you a dollar 😏`,
					`breaking news: super reader on the loose! 🚨`,
					`this just in: reader smashes interval! 📰`,
					`oh. you didn't have to read it THAT fast 💨`,
					`dang. i wish i could read like you 😔`,
					`wow... way to show everyone how to actually read!`,
					`you know you can take breaks... right?`,
					`pfft... what a nerd! reading??? a book??? 🤣`,
					`let me guess... you're on page ${Math.floor(Math.random() * 500)}. was i close?`,
					`nice one. now go take a break and frolic in a field.`,
					`interval completed! go drink some water now. you seem parched.`,
					`beep boop. interval completed. beep boop. congratulations. beep boop.`,
					`has anyone ever told you that you look like a cutie patootie when you read?`,
					`omg same, i loved that part. totally. i've read the book like 20 times soooo`,
					`it's exhausting coming up with these. sometimes i just want to say nice and be done with it, yaknow?`,
					`people keep telling me it's weird i watch you read? anyways nice completion!`,
					`when's the last time you did the macarena? just a thought. nice one!`,
					`when's the last time you square danced? just a thought. nice one!`,
					`nice! don't go too hard celebrating this completion! 🎉`,
					`hmmm. very interesting part of the book. hmmm yes. indeed.`,
					`is it just me or is it hotter in here since you completed the interval? 🥵`,
					`SLUG BUG! trust me, i saw it right out my window. anyways nice completion!`,
					`go reader! go reader! goooooo reader! 👏`,
					`niiiiiiiiiiiiiiiiiiiiiiiice`,
				]
				toast.success(choices[Math.floor(Math.random() * choices.length)])
			}
			queryClient.invalidateQueries(["intervals", clubId, readingId])
			queryClient.invalidateQueries(["user progress", intervalId])
			queryClient.invalidateQueries(["posts", clubId, readingId])
		},
	})

	return (
		<Tooltip>
			<TooltipTrigger>
				{mutation.isLoading ? (
					<Button
						variant={"ghost"}
						className="w-14 md:w-16 h-14 md:h-16 p-0 rounded-full text-primary hover:text-primary"
						disabled
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-14 md:w-16 h-14 md:h-16 animate-spin"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					</Button>
				) : (
					<Button
						variant={"ghost"}
						className="w-14 md:w-16 h-14 md:h-16 p-0 rounded-full text-primary hover:text-primary"
						onClick={() => mutation.mutate({ is_complete: !userProgress?.is_complete || false })}
					>
						{userProgress?.is_complete ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-14 md:w-16 h-14 md:h-16"
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
								className="w-14 md:w-16 h-14 md:h-16"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
						)}
					</Button>
				)}
			</TooltipTrigger>
			<TooltipContent>
				<p>{userProgress?.is_complete ? "un-complete reading" : "complete reading"}</p>
			</TooltipContent>
		</Tooltip>
	)
}
