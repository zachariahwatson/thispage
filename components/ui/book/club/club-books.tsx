"use client"

import { ClubType } from "@/utils/types"
import { ClubBook, ClubBookSkeleton } from "@/components/ui/book"
import { useEffect, useState } from "react"

/**
 * returns a list of book clubs. we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function ClubBooks() {
	const [clubs, setClubs] = useState<ClubType[]>()
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		const fetchClubs = async () => {
			const response = await fetch("http://127.0.0.1:3000/api/clubs", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok) {
				const body = await response.json()
				throw new Error(body.error)
			}

			setClubs(await response.json())
		}
		fetchClubs().then(() => setLoading(false))
	}, [])

	return !loading && clubs ? (
		clubs?.map((club: ClubType, index) => <ClubBook key={club.id} clubData={club} clubIndex={index} />)
	) : (
		<>
			<ClubBookSkeleton />
			<ClubBookSkeleton />
		</>
	)
}
