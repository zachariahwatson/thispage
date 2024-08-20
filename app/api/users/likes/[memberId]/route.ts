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
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching user's likes:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching user's likes." }, { status: 500 })
	}
}
