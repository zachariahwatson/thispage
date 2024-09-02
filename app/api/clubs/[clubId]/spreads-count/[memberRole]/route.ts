import { ClubMembership } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified club total spreads count
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: { clubId: string; memberRole: "member" | "moderator" | "admin" } }
) {
	try {
		const supabase = createClient()

		const { data, error } = await supabase
			.from("spreads_count_view")
			.select("*")
			.eq("club_id", params.clubId)
			.maybeSingle()

		if (error) {
			throw error
		}

		if ((params.memberRole === "moderator" || params.memberRole === "admin") && data && data?.total_spreads) {
			data.total_spreads += 1
		}

		return Response.json(data, { status: 200 })
	} catch (error) {
		console.error(error)
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching club spreads count:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching club spreads count." }, { status: 500 })
	}
}
