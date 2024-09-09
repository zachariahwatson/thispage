import { Interval } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified reading's intervals. rls ensures that the authenticated user is a member of the reading.
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string; readingId: string } }) {
	try {
		const supabase = createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()

		//query
		const { data, error } = await supabase
			.from("intervals")
			.select(
				`
				id,
                goal_page,
				goal_section,
                created_at,
                member_interval_progresses (
					id,
					is_complete,
					member:members (
						id, 
						user_id,
						...users (
							name,
							first_name,
							last_name,
							avatar_url
						)
					)
				)
				`
			)
			.eq("reading_id", params.readingId)
			//excluding user
			.neq("member_interval_progresses.member.user_id", user?.id)
			.not("member_interval_progresses.member", "is", null)
			.order("goal_page", { ascending: false })
			.order("goal_section", { ascending: false })

		if (error) {
			throw error
		}

		// Sort member_interval_progresses so that the user's progresses are always first
		// const sortedData = data.map((interval) => {
		// 	interval.member_interval_progresses.sort((a, b) => {
		// 		if (a.member?.user_id === user?.id) return -1
		// 		if (b.member?.user_id === user?.id) return 1
		// 		return 0
		// 	})
		// 	return interval
		// })

		return Response.json(data as Interval[], { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching the reading's intervals:\n", error)
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
						message: "an error occurred while fetching the reading's intervals :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
