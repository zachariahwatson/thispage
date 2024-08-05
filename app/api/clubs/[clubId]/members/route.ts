import { ClubMembership, InviteCode, Member } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified club's members.
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()

		const { data, error } = await supabase
			.from("members")
			.select(
				`
				id,
                ...users (
                    name,
                    first_name,
                    last_name,
                    avatar_url
                ),
                ...member_roles!member_roles_member_id_fkey (
                    role
                )

			`
			)
			.eq("club_id", params.clubId)

		if (error) {
			throw error
		}

		return Response.json(data as Member[], { status: 200 })
	} catch (error) {
		console.error(error)
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching club invite codes:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching club invite codes." }, { status: 500 })
	}
}
