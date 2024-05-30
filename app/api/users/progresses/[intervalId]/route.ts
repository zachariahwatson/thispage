import { MemberProgress } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified reading's intervals. rls ensures that the authenticated user is a member of the reading.
 */
export async function GET(request: NextRequest, { params }: { params: { intervalId: string } }) {
	try {
		if (params.intervalId === "null") {
			return Response.json(null, { status: 200 })
		}

		const supabase = createClient()

		const membershipIds: number[] = (await getUserMembershipIds())?.map((item) => item.id) || []

		//query
		const { data, error } = await supabase
			.from("member_interval_progresses")
			.select(
				`
				id,
                is_complete
				`
			)
			.eq("interval_id", params.intervalId)
			.in("member_id", membershipIds)
			.maybeSingle()

		if (error) {
			throw error
		}

		return Response.json(data as MemberProgress, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching the member's interval progress:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching the member's interval progress." }, { status: 500 })
	}
}

/**
 * gets the authenticated user's club memberships.
 */
async function getUserMembershipIds() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const { data, error } = await supabase
		.from("members")
		.select("id")
		.eq("user_id", user?.id || "")

	if (error) {
		console.error("error getting user membership ids: " + error.message + ". " + error.hint)
	}

	return data
}
