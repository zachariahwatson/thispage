"use client"

import { ClubType } from "@/utils/types"
import { ClubBook } from "@/components/ui/book"
import { useEffect, useState } from "react"

export async function ClubBooksSuspense() {
	const [clubs, setClubs] = useState<ClubType[]>()

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
		fetchClubs()
	}, [])

	return clubs?.map(async (club: ClubType, index) => <ClubBook clubData={club} clubIndex={index} />)
}
