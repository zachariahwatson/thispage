import { MemberProgress, Reading } from "@/lib/types"
import { useQuery } from "react-query"

/**
 * retrieves the club's readings.
 */
export function useUserProgress(intervalId: number | null, memberId: number | null) {
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	//fetch the user's progress
	return useQuery<MemberProgress>({
		queryKey: ["user progress", intervalId],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/users/progresses/${memberId}/intervals/${intervalId}`)
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
