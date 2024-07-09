"use client"

import { ClubBook, ClubBookSkeleton } from "@/components/ui/book"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui"
import { ClubMembership } from "@/lib/types"
import { useQuery } from "react-query"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

/**
 * returns a list of book clubs. we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function ClubBooks() {
	const fetchClubs = async () => {
		const response = await fetch(`${defaultUrl}/api/clubs`, {
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

	const { data: clubMemberships, isLoading: loading } = useQuery<ClubMembership[]>(["clubs"], () => fetchClubs())

	return !loading && clubMemberships ? (
		clubMemberships.length > 0 ? (
			clubMemberships.map((clubMembership, index) => <ClubBook key={index} clubMembershipData={clubMembership} />)
		) : (
			<Card className="max-w-lg w-full h-96">
				<CardHeader>
					<CardTitle>
						welcome to this<span className="font-bold">page</span>! to get started, create a club or join one through an
						invite link.
					</CardTitle>
				</CardHeader>
			</Card>
		)
	) : (
		<>
			<ClubBookSkeleton />
			<ClubBookSkeleton />
		</>
	)
}
