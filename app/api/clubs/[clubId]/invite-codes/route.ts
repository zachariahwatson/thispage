import { ClubMembership, InviteCode } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified club's invite codes.
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()

		const { data, error } = await supabase
			.from("club_invite_codes")
			.select(
				`
				id,
				club_id,
                expiration_date,
				code,
				uses,
				created_at,
				creator:creator_member_id (
					...users (
                        name,
                        first_name,
                        last_name,
                        avatar_url
                    )
				)
			`
			)
			.eq("club_id", params.clubId)

		if (error) {
			throw error
		}

		return Response.json(data as unknown as InviteCode[], { status: 200 })
	} catch (error) {
		console.error(error)
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching club invite codes:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching club invite codes." }, { status: 500 })
	}
}
