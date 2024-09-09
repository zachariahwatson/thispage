import { ClubMembership } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified club info but sanitized for anon role
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()

		const { data, error } = await supabase.from("club_invite_view").select("*").eq("id", params.clubId).maybeSingle()

		if (error) {
			throw error
		}

		return Response.json(data, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching club:\n", error)
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
						message: "an error occurred while fetching the club :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
