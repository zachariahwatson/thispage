"use client"

import { ClubBook, ClubBookSkeleton } from "@/components/ui/book"
import { ClubMembership } from "@/lib/types"
import { useQuery } from "react-query"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
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
		clubMemberships.map((clubMembership, index) => <ClubBook key={index} clubMembershipData={clubMembership} />)
	) : (
		<>
			<ClubBookSkeleton />
			<ClubBookSkeleton />
		</>
	)
}
