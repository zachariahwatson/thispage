import { ClubMembership } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"

/**
 * gets the authenticated user's clubs with memberships.
 */
export async function GET() {
	try {
		const supabase = createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (user) {
			const { data, error } = await supabase
				.from("members")
				.select(
					`
				id,
				club:clubs!members_club_id_fkey (
					id,
					name,
					description
				),
				is_favorite,
				...member_roles!member_roles_member_id_fkey(
					role
				)
			`
				)
				.eq("user_id", user?.id || "")

			if (error) {
				throw error
			}

			return Response.json(data as ClubMembership[], { status: 200 })
		}

		return Response.json(null, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching club memberships:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching club memberships." }, { status: 500 })
	}
}
