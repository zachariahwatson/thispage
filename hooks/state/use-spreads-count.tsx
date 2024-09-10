import { Database } from "@/lib/types"
import { QueryError } from "@/utils/errors"
import { useQuery } from "react-query"

type SpreadsCount = Database["public"]["Views"]["spreads_count_view"]["Row"]

/**
 * retrieves the club's spreads count.
 */
export function useSpreadsCount(clubId: number | null, memberRole: "member" | "moderator" | "admin") {
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	//fetch the reading's intervals
	return useQuery<SpreadsCount>({
		queryKey: ["spreads count", clubId, memberRole],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubId}/spreads-count/${memberRole}`)
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok) {
				const body = await response.json()
				throw new QueryError(body.message, body.code)
			}

			return await response.json()
		},
	})
}
