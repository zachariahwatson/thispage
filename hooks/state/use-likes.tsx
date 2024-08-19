import { ClubMembership, Like } from "@/lib/types"
import { useQuery } from "react-query"
import { useUser } from "./use-user"

/**
 * retrieves the current user's clubs.
 */
export function useLikes({ memberId }: { memberId: string }) {
	const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000"

	return useQuery<Like[]>({
		queryKey: ["likes", memberId],
		queryFn: async () => {
			const response = await fetch(`${defaultUrl}/api/users/likes/${memberId}`, {
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
