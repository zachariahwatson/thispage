"use client"

import { ClubType } from "@/utils/types"
import { ClubBook, ClubBookSkeleton } from "@/components/ui/book"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

/**
 * returns a list of book clubs. we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function ClubBooks() {
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

		return await response.json()
	}

	const { data: clubs, isLoading: loading } = useQuery<ClubType[]>(["clubs"], () => fetchClubs())

	return !loading && clubs ? (
		clubs?.map((club: ClubType, index) => <ClubBook key={club.id} clubData={club} clubIndex={index} />)
	) : (
		<>
			<ClubBookSkeleton />
			<ClubBookSkeleton />
		</>
	)
}
