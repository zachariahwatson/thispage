"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui"
import { Button, JoinClubButton } from "@/components/ui/buttons"
import { createClient } from "@/utils/supabase/client"
import { redirect } from "next/navigation"
import { useQuery } from "react-query"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
	: "http://localhost:3000"

export default function Page({ params }: { params: { clubId: string; inviteCode: string } }) {
	const router = useRouter()
	const supabase = createClient()
	const [user, setUser] = useState<User>()

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser()
			if (user) {
				setUser(user)
			} else {
				router.push("/login")
			}
		}

		fetchUser()
	}, [supabase])

	const fetchClub = async () => {
		const url = new URL(`${defaultUrl}/api/clubs/${params.clubId}`)
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

	const { data: club, isLoading: loading } = useQuery(["club", params.clubId], () => fetchClub())

	return (
		club &&
		!loading && (
			<Card className="max-w-md">
				<CardHeader>
					<CardTitle>{club.name}</CardTitle>
					<CardDescription className="text-md italic">has invited you!</CardDescription>
				</CardHeader>
				<CardContent>
					<p>{club.description}</p>
				</CardContent>
				<CardFooter>
					<JoinClubButton clubId={params.clubId} inviteCode={params.inviteCode} len={club.members.length} />
				</CardFooter>
			</Card>
		)
	)
}
