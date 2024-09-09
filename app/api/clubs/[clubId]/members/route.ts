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
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching club invite codes:\n", error)
		switch (error.code) {
			case "42501":
				return Response.json(
					{
						message: "you don't have permission to do that :(",
						code: error.code,
					},
					{ status: 500 }
				)
			default:
				return Response.json(
					{
						message: "an error occurred while fetching the club's invite codes :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
