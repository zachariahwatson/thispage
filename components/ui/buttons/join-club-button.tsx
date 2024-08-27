"use client"

import { useMutation, useQueryClient } from "react-query"
import { Button } from "./button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Props {
	clubId: string
	inviteCode: string
	len: number
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function JoinClubButton({ clubId, inviteCode, len }: Props) {
	const queryClient = useQueryClient()
	const router = useRouter()
	const mutation = useMutation({
		mutationFn: (newMember: { club_id: number; used_club_invite_code: string }) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubId}/members/invite/${inviteCode}`)
			return fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newMember),
			})
		},
		onSuccess: () => {
			toast.success("club joined!")
			queryClient.invalidateQueries(["clubs"])
			router.push("/")
		},
	})

	return mutation.isLoading ? (
		<Button disabled className="w-full">
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
				mutation.mutate({ club_id: Number(clubId), used_club_invite_code: inviteCode })
			}}
			className="w-full"
		>
			join {len} others
		</Button>
	)
}
