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
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching club spreads count:\n", error)
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
						message: "an error occurred while fetching club spreads count :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
