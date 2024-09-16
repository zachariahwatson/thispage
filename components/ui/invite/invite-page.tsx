"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui"
import { JoinClubButton } from "@/components/ui/buttons"
import { createClient } from "@/utils/supabase/client"
import { useQuery } from "react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { useClubs } from "@/hooks/state"
import { ClubMembership } from "@/lib/types"
import Link from "next/link"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function InvitePage({ params }: { params: { clubId: string; inviteCode: string } }) {
	const router = useRouter()
	const supabase = createClient()
	const [user, setUser] = useState<User>()
	const { data: clubMemberships, isLoading: clubsLoading } = useClubs()
	const isMember = clubMemberships?.some(
		(clubMembership: ClubMembership) => Number(params.clubId) === clubMembership.club.id
	)
	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (user) {
				setUser(user)
			} else {
				router.push(`/login?redirect=${defaultUrl}/invite/${params.clubId}/${params.inviteCode}`)
			}
		}
		fetchUser()
	}, [supabase])
	const fetchClub = async () => {
		const url = new URL(`${defaultUrl}/api/clubs/${params.clubId}/invite`)
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
		if (!response.ok) {
			const body = await response.json()
			throw new Error(body.error)
		}
		return await response.json()
	}
	const { data: club, isLoading: loading } = useQuery(
		["club", params.clubId],
		() => fetchClub(),
		{ enabled: !!user } // Run the query only when the user is available
	)
	return !clubsLoading && clubMemberships ? (
		!isMember ? (
			!loading && club ? (
				<Card className="max-w-lg w-full">
					<CardHeader>
						<CardTitle>{club.name}</CardTitle>
						<CardDescription className="text-md italic">has invited you!</CardDescription>
					</CardHeader>
					<CardContent>
						<p>{club.description}</p>
					</CardContent>
					<CardFooter className="flex justify-center">
						<JoinClubButton clubId={params.clubId} inviteCode={params.inviteCode} len={club.total_members} />
					</CardFooter>
				</Card>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="size-6 animate-spin"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
					/>
				</svg>
			)
		) : !loading && club ? (
			<div className="space-y-4 text-center w-full p-x-6">
				<p className="md:text-xl mb-2">you are already a member of {club.name}!</p>
				<Link href="/" className="text-muted-foreground hover:underline">
					back to home
				</Link>
			</div>
		) : (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="size-6 animate-spin"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
				/>
			</svg>
		)
	) : (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
			className="size-6 animate-spin"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
			/>
		</svg>
	)
}
