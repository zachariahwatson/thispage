import { Interval, MemberProgress, Reading } from "@/lib/types"
import { QueryError } from "@/utils/errors"
import { useQuery } from "react-query"

/**
 * retrieves the club's readings.
 */
export function useIntervals(clubId: number | null, readingId: number | null) {
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	//fetch the reading's intervals
	return useQuery<Interval[]>({
		queryKey: ["intervals", clubId, readingId],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubId}/readings/${readingId}/intervals`)
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
