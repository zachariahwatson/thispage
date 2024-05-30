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
			.order("goal_page", { ascending: false })

		if (error) {
			throw error
		}

		// Sort member_interval_progresses so that the user's progresses are always first
		const sortedData = data.map((interval) => {
			interval.member_interval_progresses.sort((a, b) => {
				if (a.member?.user_id === user?.id) return -1
				if (b.member?.user_id === user?.id) return 1
				return 0
			})
			return interval
		})

		return Response.json(sortedData as Interval[], { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching reading intervals:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching reading intervals." }, { status: 500 })
	}
}
