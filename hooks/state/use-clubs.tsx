import { ClubMembership } from "@/lib/types"
import { useQuery } from "react-query"

/**
 * retrieves the current user's clubs.
 */
export function useClubs() {
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	return useQuery<ClubMembership[]>({
		queryKey: ["clubs"],
		queryFn: async () => {
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
		},
	})
}
