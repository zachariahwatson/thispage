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

export function CompleteIntervalButton({ clubId, readingId, memberId, intervalId, userProgress }: Props) {
	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: (data: { is_complete: boolean }) => {
			const url = new URL(`http://localhost:3000/api/users/progresses/${memberId}/intervals/${intervalId}`)
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
				toast.success("completed reading interval!")
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
