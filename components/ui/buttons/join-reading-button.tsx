"use client"

import { Button } from "@/components/ui/buttons"
import { useClubMembership } from "@/contexts"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"

interface Props {
	readingId: number | null
	intervalId: number | null
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function JoinReadingButton({ readingId, intervalId }: Props) {
	const clubMembership = useClubMembership()
	const queryClient = useQueryClient()
	const mutation = useMutation({
		mutationFn: (newProgress: { member_id: number; interval_id: number }) => {
			const url = new URL(
				`${defaultUrl}/api/clubs/${clubMembership?.club.id}/readings/${readingId}/intervals/${intervalId}/member-interval-progresses`
			)
			return fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newProgress),
			})
		},
		onSuccess: () => {
			toast.success("joined reading!")
			queryClient.invalidateQueries(["intervals", clubMembership?.club.id, readingId])
			queryClient.invalidateQueries(["user progress", intervalId])
		},
	})
	const router = useRouter()
	return mutation.isLoading ? (
		<Button disabled className="mt-4">
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
			joining...
		</Button>
	) : (
		<Button
			onClick={() => {
				if (intervalId !== null) {
					mutation.mutate({ member_id: clubMembership?.id || -1, interval_id: intervalId })
				}
			}}
			className="mt-4"
		>
			join reading
		</Button>
	)
}
