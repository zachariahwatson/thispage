import { Like } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified user's likes.
 */
export async function GET(request: NextRequest, { params }: { params: { memberId: string } }) {
	try {
		const supabase = createClient()

		//query
		const { data, error } = await supabase
			.from("likes")
			.select(
				`
				id,
                member_id,
                post_id,
				comment_id
               
			`
			)
			.eq("member_id", params.memberId)

		if (error) {
			throw error
		}

		return Response.json(data as Like[], { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching user's likes:\n", error)
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
						message: "an error occurred while fetching user's likes :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
