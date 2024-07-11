import { ClubMembership } from "@/lib/types"
import { AuthUser, User } from "@supabase/supabase-js"
import { useQuery } from "react-query"

/**
 * retrieves the current user's clubs.
 */
export function useUser() {
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const url = new URL(`${defaultUrl}/api/users`)
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
