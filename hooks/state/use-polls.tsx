import { Poll } from "@/lib/types"
import { useQuery } from "react-query"

/**
 * retrieves the club's readings.
 */
export function usePolls(clubId: number, memberId: number) {
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	return useQuery<Poll[]>({
		queryKey: ["polls", clubId],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubId}/polls?memberId=${memberId}`)
			url.searchParams.append("archived", "false")
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
		},
	})
}
